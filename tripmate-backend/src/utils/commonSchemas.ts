import { z } from 'zod';

// Shared param-validation helper: every `:id`-style route param is validated
// as a UUID before it ever reaches a Prisma query (defense in depth on top of
// Prisma's own parameterization — a non-UUID simply 400s instead of
// round-tripping to the DB at all).
export function uuidParam(name: string) {
  return z.object({ [name]: z.string().uuid(`${name} must be a valid id`) }).strict();
}

// For routes with multiple path params that each need UUID validation
// (e.g. `/trips/:tripId/members/:memberId`) — a single strict object so an
// unrecognized extra param still gets rejected.
export function uuidParams(...names: string[]) {
  const shape: Record<string, z.ZodString> = {};
  for (const name of names) {
    shape[name] = z.string().uuid(`${name} must be a valid id`);
  }
  return z.object(shape).strict();
}

export const paginationQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(20),
  })
  .strict();
