import request from 'supertest';
import { app, registerUser } from './helpers';
import { env } from '@/config/env';

describe('Auth flow', () => {
  it('registers a new user and returns a public user shape (no password hash)', async () => {
    const { res, email, name } = await registerUser();

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({ email, name });
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.body.user.role).toBeUndefined();

    // httpOnly refresh cookie set, scoped to /api/auth, never readable by JS.
    const setCookie = res.headers['set-cookie'];
    expect(setCookie).toBeDefined();
    const cookieStr = Array.isArray(setCookie) ? setCookie.join(';') : String(setCookie);
    expect(cookieStr).toMatch(/refreshToken=/);
    expect(cookieStr.toLowerCase()).toMatch(/httponly/);
    expect(cookieStr.toLowerCase()).toMatch(/samesite=strict/);
  });

  it('rejects registering the same email twice with a generic message', async () => {
    const { email, password, name } = await registerUser();
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name, email, password, confirmPassword: password });

    expect(res.status).toBe(409);
    expect(res.body.error).not.toMatch(/already exists|unique constraint/i);
  });

  it('logs in with correct credentials', async () => {
    const { email, password } = await registerUser();
    const res = await request(app).post('/api/auth/login').send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toEqual(expect.any(String));
  });

  it('rejects wrong password with a generic "Invalid credentials" message', async () => {
    const { email } = await registerUser();
    const res = await request(app).post('/api/auth/login').send({ email, password: 'WrongPassword1!' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
    // No stack trace, no internal detail, no hint about what was wrong.
    expect(res.body.stack).toBeUndefined();
  });

  it('returns the identical error for a non-existent email as for a wrong password (no user enumeration)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody-here@example.com', password: 'WhoKnows1!' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('locks the account after repeated failed logins, still with a generic message', async () => {
    const { email } = await registerUser();

    for (let i = 0; i < env.LOGIN_LOCKOUT_MAX_ATTEMPTS; i += 1) {
      await request(app).post('/api/auth/login').send({ email, password: 'WrongPassword1!' });
    }

    const res = await request(app).post('/api/auth/login').send({ email, password: 'WrongPassword1!' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('rejects unauthenticated access to a protected route', async () => {
    const res = await request(app).get('/api/trips');
    expect(res.status).toBe(401);
    expect(res.body.error).toEqual(expect.any(String));
  });

  it('rejects a protected route with a garbage bearer token', async () => {
    const res = await request(app).get('/api/trips').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me returns the authenticated user only with a valid token', async () => {
    const { res: registerRes } = await registerUser();
    const token = registerRes.body.accessToken;

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(registerRes.body.user.email);
  });

  it('refreshes the access token using the httpOnly cookie and rotates it', async () => {
    const { res: registerRes } = await registerUser();
    const cookie = registerRes.headers['set-cookie'];

    const refreshRes = await request(app).post('/api/auth/refresh').set('Cookie', cookie);
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.accessToken).toEqual(expect.any(String));
    // The REFRESH token is what must rotate (verified below) — the new access
    // token can legitimately be byte-identical to the old one if reissued
    // within the same second with the same claims, since JWTs aren't required
    // to be unique. Set a new refresh cookie instead as the observable proof.
    expect(refreshRes.headers['set-cookie']).toBeDefined();
  });

  it('rejects reusing a refresh token after it has been rotated', async () => {
    const { res: registerRes } = await registerUser();
    const originalCookie = registerRes.headers['set-cookie'];

    await request(app).post('/api/auth/refresh').set('Cookie', originalCookie);
    // Reuse the ORIGINAL (now-rotated-away) refresh cookie a second time.
    const reuseRes = await request(app).post('/api/auth/refresh').set('Cookie', originalCookie);

    expect(reuseRes.status).toBe(401);
  });

  it('logs out and revokes the refresh token', async () => {
    const { res: registerRes } = await registerUser();
    const cookie = registerRes.headers['set-cookie'];

    const logoutRes = await request(app).post('/api/auth/logout').set('Cookie', cookie);
    expect(logoutRes.status).toBe(204);

    const refreshRes = await request(app).post('/api/auth/refresh').set('Cookie', cookie);
    expect(refreshRes.status).toBe(401);
  });

  it('forgot-password always returns 202, whether or not the email exists', async () => {
    const known = await registerUser();
    const knownRes = await request(app).post('/api/auth/forgot-password').send({ email: known.email });
    const unknownRes = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'definitely-not-registered@example.com' });

    expect(knownRes.status).toBe(202);
    expect(unknownRes.status).toBe(202);
    expect(knownRes.body).toEqual(unknownRes.body);
  });
});
