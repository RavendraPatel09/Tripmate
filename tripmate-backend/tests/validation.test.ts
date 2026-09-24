import request from 'supertest';
import { app, registerUser } from './helpers';

describe('Input validation', () => {
  it('rejects registration with an invalid email using a generic 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A B', email: 'not-an-email', password: 'Passw0rd!', confirmPassword: 'Passw0rd!' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid request data');
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'email' })]),
    );
  });

  it('rejects registration with a too-short / low-complexity password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A B', email: 'valid@example.com', password: 'short', confirmPassword: 'short' });

    expect(res.status).toBe(400);
  });

  it('rejects mismatched password/confirmPassword', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'A B',
      email: 'valid2@example.com',
      password: 'Passw0rd!',
      confirmPassword: 'Different1!',
    });

    expect(res.status).toBe(400);
  });

  it('rejects an unknown/extra field in the body (mass-assignment protection)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'A B',
      email: 'valid3@example.com',
      password: 'Passw0rd!',
      confirmPassword: 'Passw0rd!',
      role: 'ADMIN',
    });

    expect(res.status).toBe(400);
  });

  it('rejects a non-UUID path param instead of 500ing', async () => {
    const { res: registerRes } = await registerUser();
    const token = registerRes.body.accessToken;

    const res = await request(app)
      .get('/api/trips/not-a-uuid')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it('rejects an out-of-range enum value for expense category', async () => {
    const { res: registerRes } = await registerUser();
    const token = registerRes.body.accessToken;

    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100, category: 'NotARealCategory', description: 'x', date: '2027-01-01' });

    expect(res.status).toBe(400);
  });

  it('rejects a negative/invalid amount', async () => {
    const { res: registerRes } = await registerUser();
    const token = registerRes.body.accessToken;

    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: -50, category: 'Food', description: 'x', date: '2027-01-01' });

    expect(res.status).toBe(400);
  });

  it('never leaks a stack trace or SQL detail on an internal error response', async () => {
    // Malformed JSON body — Express's body-parser throws a SyntaxError, which
    // must still be normalized to a generic response by the central handler.
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{ this is not valid json');

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(JSON.stringify(res.body)).not.toMatch(/at\s+\w+.*\(.*:\d+:\d+\)/); // no stack-trace-shaped string
    expect(res.body.stack).toBeUndefined();
  });
});
