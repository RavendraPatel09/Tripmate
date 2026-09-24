import { AppError } from '@/utils/AppError';

// Reusable ownership-enforcement pattern used by every user-owned resource
// (trips, packing items, expenses, notifications, saved destinations, ...).
// Every module calls through these helpers instead of hand-rolling
// `WHERE userId = req.user.id` per route — the ownership filter always lives
// at the query level, never as a post-fetch check on the response body.
//
// Deliberately returns 404 (not 403) when a row exists but belongs to another
// user, so probing/enumerating another user's resource IDs can't even
// distinguish "doesn't exist" from "exists but isn't yours" (IDOR hardening).

interface FindFirstDelegate<T> {
  findFirst(args: { where: { id: string; userId: string } }): Promise<T | null>;
}

interface MutateManyDelegate {
  updateMany(args: { where: { id: string; userId: string }; data: Record<string, unknown> }): Promise<{ count: number }>;
  deleteMany(args: { where: { id: string; userId: string } }): Promise<{ count: number }>;
}

export async function findOwnedOrThrow<T>(
  delegate: FindFirstDelegate<T>,
  id: string,
  userId: string,
  resourceName = 'Resource',
): Promise<T> {
  const record = await delegate.findFirst({ where: { id, userId } });
  if (!record) {
    throw AppError.notFound(`${resourceName} not found`);
  }
  return record;
}

export async function updateOwnedOrThrow(
  delegate: MutateManyDelegate,
  id: string,
  userId: string,
  data: Record<string, unknown>,
  resourceName = 'Resource',
): Promise<void> {
  const { count } = await delegate.updateMany({ where: { id, userId }, data });
  if (count === 0) {
    throw AppError.notFound(`${resourceName} not found`);
  }
}

export async function deleteOwnedOrThrow(
  delegate: MutateManyDelegate,
  id: string,
  userId: string,
  resourceName = 'Resource',
): Promise<void> {
  const { count } = await delegate.deleteMany({ where: { id, userId } });
  if (count === 0) {
    throw AppError.notFound(`${resourceName} not found`);
  }
}
