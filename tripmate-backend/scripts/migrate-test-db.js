// Applies migrations to the test database before the test suite runs.
// Kept as a tiny standalone script (rather than inline in package.json) so
// it's easy to read and reuse in CI.
const path = require('node:path');
const { execSync } = require('node:child_process');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.test') });

execSync('npx prisma migrate deploy', {
  stdio: 'inherit',
  env: process.env,
});
