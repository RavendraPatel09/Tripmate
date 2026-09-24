import request from 'supertest';
import { createApp } from '@/app';
import { prisma } from '@/lib/prisma';

export const app = createApp();

let userCounter = 0;

export async function registerUser(overrides: Partial<{ name: string; email: string; password: string }> = {}) {
  userCounter += 1;
  const email = overrides.email ?? `user${userCounter}-${Date.now()}@example.com`;
  const password = overrides.password ?? 'Sup3rSecret!';
  const name = overrides.name ?? `Test User ${userCounter}`;

  const res = await request(app)
    .post('/api/auth/register')
    .send({ name, email, password, confirmPassword: password });

  return { res, email, password, name };
}

export async function makeAdmin(email: string) {
  return prisma.user.update({ where: { email }, data: { role: 'ADMIN' } });
}
