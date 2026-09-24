import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

// Wipe every table between test files/runs so tests never depend on
// leftover state. Order matters only insofar as FK cascades handle most of
// it, but TRUNCATE ... CASCADE sidesteps ordering entirely.
export async function resetDatabase(): Promise<void> {
  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != '_prisma_migrations'
  `;
  if (tables.length === 0) return;
  // Table identifiers can't be bound parameters in SQL, so this can't use a
  // tagged-template $queryRaw. It's still safe: `tableNames` comes from our
  // own Postgres catalog (pg_tables), never from request/user input, and this
  // file only ever runs against the test database. This is test-only
  // scaffolding, not part of the app's request-handling code path.
  const tableNames = tables.map((t) => `"${t.tablename}"`).join(', ');
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`);
}

beforeEach(async () => {
  await resetDatabase();
  await redis.flushdb();
});

afterAll(async () => {
  await prisma.$disconnect();
  redis.disconnect();
});
