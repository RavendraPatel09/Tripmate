import { PrismaClient } from '@prisma/client';
import { env } from '@/config/env';

// Prisma Client is the ONLY way this codebase talks to Postgres. Every query
// goes through its parameterized query builder — see AGENTS/security checklist
// item "No SQL injection". `$queryRawUnsafe` must never appear in this codebase.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}
