import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'node:path';

// `.env.test` takes precedence in the test runner (see jest.config.js /
// tests/setup.ts which set NODE_ENV=test); falls back to `.env` otherwise.
dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV ?? 'development'}`) });
dotenv.config();

// Fail fast and loud at boot if the environment is misconfigured — never limp
// along with `undefined` secrets that would silently break auth or leak errors.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),

  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().int().positive().default(15),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),

  COOKIE_DOMAIN: z.string().optional().default(''),
  COOKIE_SECURE: z.coerce.boolean().default(false),

  CORS_ORIGINS: z.string().min(1, 'CORS_ORIGINS is required'),

  LOGIN_LOCKOUT_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
  LOGIN_LOCKOUT_MINUTES: z.coerce.number().int().positive().default(15),
  PASSWORD_RESET_TOKEN_TTL_MINUTES: z.coerce.number().int().positive().default(30),

  LOG_LEVEL: z.string().default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

if (parsed.data.JWT_ACCESS_SECRET === parsed.data.JWT_REFRESH_SECRET) {
  // eslint-disable-next-line no-console
  console.error('❌ JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different values.');
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === 'production',
  isTest: parsed.data.NODE_ENV === 'test',
  corsOrigins: parsed.data.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
};
