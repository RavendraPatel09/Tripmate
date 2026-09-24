import request from 'supertest';
import { app, registerUser, makeAdmin } from './helpers';

// Every /api/admin/* route requires role=ADMIN, checked server-side from the
// DB (never from a client-supplied field) — see modules/admin/admin.routes.ts,
// gated once at the router level.
describe('Admin route protection', () => {
  const adminRoutes: Array<{ method: 'get' | 'post' | 'put' | 'delete' | 'patch'; path: string }> = [
    { method: 'get', path: '/api/admin/users' },
    { method: 'post', path: '/api/admin/destinations' },
    { method: 'post', path: '/api/admin/foods' },
    { method: 'post', path: '/api/admin/hidden-gems' },
    { method: 'post', path: '/api/admin/events' },
    { method: 'post', path: '/api/admin/emergency-contacts' },
    { method: 'post', path: '/api/admin/achievements' },
  ];

  it('rejects every admin route for an unauthenticated caller', async () => {
    for (const route of adminRoutes) {
      const res = await request(app)[route.method](route.path);
      expect(res.status).toBe(401);
    }
  });

  it('rejects every admin route for a logged-in NON-admin user (403)', async () => {
    const { res: registerRes } = await registerUser();
    const token = registerRes.body.accessToken;

    for (const route of adminRoutes) {
      const res = await request(app)[route.method](route.path).set('Authorization', `Bearer ${token}`).send({});
      expect(res.status).toBe(403);
    }
  });

  it('ignores a client-supplied role claim/header and still enforces the DB role', async () => {
    const { res: registerRes, email } = await registerUser();
    const token = registerRes.body.accessToken;
    void email;

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`)
      // Attempting to smuggle admin via a header/body field — must be ignored entirely.
      .set('X-Role', 'ADMIN')
      .send({ role: 'ADMIN', isAdmin: true });

    expect(res.status).toBe(403);
  });

  it('allows an ADMIN-role user through', async () => {
    const { res: registerRes, email } = await registerUser();
    await makeAdmin(email);

    // The already-issued access token still carries the OLD role in its JWT
    // claim, but requireAuth re-fetches the role from the DB on every
    // request — so promoting the user takes effect immediately without a
    // new login, proving the token's own role claim is never trusted.
    const token = registerRes.body.accessToken;

    const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it('creates a destination as admin and it is publicly readable', async () => {
    const { res: registerRes, email } = await registerUser();
    await makeAdmin(email);
    const token = registerRes.body.accessToken;

    const createRes = await request(app)
      .post('/api/admin/destinations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test City',
        description: 'A place for tests',
        image: 'https://example.com/image.jpg',
        budgetTier: 'mid-range',
      });
    expect(createRes.status).toBe(201);

    const publicRes = await request(app).get('/api/destinations');
    expect(publicRes.status).toBe(200);
    expect(publicRes.body.destinations.some((d: { name: string }) => d.name === 'Test City')).toBe(true);
  });

  it('prevents an admin from demoting/changing their own role', async () => {
    const { res: registerRes, email } = await registerUser();
    const admin = await makeAdmin(email);
    const token = registerRes.body.accessToken;

    const res = await request(app)
      .patch(`/api/admin/users/${admin.id}/role`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'USER' });

    expect(res.status).toBe(400);
  });
});
