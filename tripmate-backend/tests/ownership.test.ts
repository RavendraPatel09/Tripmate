import request from 'supertest';
import { app, registerUser } from './helpers';

// IDOR protection: user A must never be able to read/modify/delete user B's
// resources by guessing/enumerating IDs — even a real, valid ID belonging to
// someone else must come back as if it doesn't exist.
describe('Cross-user data access (IDOR) protection', () => {
  async function createTripAsUserA() {
    const userA = await registerUser();
    const tripRes = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${userA.res.body.accessToken}`)
      .send({
        title: "User A's private trip",
        destinationName: 'Goa',
        startDate: '2027-01-01',
        endDate: '2027-01-05',
      });
    expect(tripRes.status).toBe(201);
    return { userA, tripId: tripRes.body.trip.id as string };
  }

  it('blocks GET of another user\'s trip by a real, valid trip id', async () => {
    const { tripId } = await createTripAsUserA();
    const userB = await registerUser();

    const res = await request(app)
      .get(`/api/trips/${tripId}`)
      .set('Authorization', `Bearer ${userB.res.body.accessToken}`);

    // 404, not 403 — doesn't even confirm the resource exists.
    expect(res.status).toBe(404);
  });

  it('blocks PUT of another user\'s trip', async () => {
    const { tripId } = await createTripAsUserA();
    const userB = await registerUser();

    const res = await request(app)
      .put(`/api/trips/${tripId}`)
      .set('Authorization', `Bearer ${userB.res.body.accessToken}`)
      .send({ title: 'Hijacked title' });

    expect(res.status).toBe(404);
  });

  it('blocks DELETE of another user\'s trip, and it still exists for its rightful owner', async () => {
    const { userA, tripId } = await createTripAsUserA();
    const userB = await registerUser();

    const res = await request(app)
      .delete(`/api/trips/${tripId}`)
      .set('Authorization', `Bearer ${userB.res.body.accessToken}`);
    expect(res.status).toBe(404);

    const asOwner = await request(app)
      .get(`/api/trips/${tripId}`)
      .set('Authorization', `Bearer ${userA.res.body.accessToken}`);
    expect(asOwner.status).toBe(200);
  });

  it('blocks reading another user\'s packing items and expenses by ID', async () => {
    const userA = await registerUser();
    const packingRes = await request(app)
      .post('/api/packing-items')
      .set('Authorization', `Bearer ${userA.res.body.accessToken}`)
      .send({ name: 'Passport', category: 'Documents' });
    expect(packingRes.status).toBe(201);

    const expenseRes = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${userA.res.body.accessToken}`)
      .send({ amount: 500, category: 'Food', description: 'Lunch', date: '2027-01-02' });
    expect(expenseRes.status).toBe(201);

    const userB = await registerUser();

    const patchRes = await request(app)
      .patch(`/api/packing-items/${packingRes.body.packingItem.id}`)
      .set('Authorization', `Bearer ${userB.res.body.accessToken}`)
      .send({ isPacked: true });
    expect(patchRes.status).toBe(404);

    const deleteRes = await request(app)
      .delete(`/api/expenses/${expenseRes.body.expense.id}`)
      .set('Authorization', `Bearer ${userB.res.body.accessToken}`);
    expect(deleteRes.status).toBe(404);

    // User B's own (empty) list never contains user A's data either way.
    const listRes = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${userB.res.body.accessToken}`);
    expect(listRes.body.expenses).toHaveLength(0);
  });

  it("blocks managing another user's trip members (nested ownership check)", async () => {
    const { tripId } = await createTripAsUserA();
    const userB = await registerUser();

    const res = await request(app)
      .post(`/api/trips/${tripId}/members`)
      .set('Authorization', `Bearer ${userB.res.body.accessToken}`)
      .send({ name: 'Intruder' });

    expect(res.status).toBe(404);
  });
});
