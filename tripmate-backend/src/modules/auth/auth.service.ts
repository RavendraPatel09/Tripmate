import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateOpaqueToken,
} from '@/lib/jwt';
import { env } from '@/config/env';
import { AppError } from '@/utils/AppError';
import { logger } from '@/lib/logger';
import type { User } from '@prisma/client';

// Precomputed once and reused for every "user does not exist" login attempt
// so `argon2.verify` always runs for the same cost regardless of whether the
// email is registered — keeps the login failure path's timing consistent
// and avoids leaking account existence through a timing side-channel.
let dummyHashPromise: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  if (!dummyHashPromise) {
    dummyHashPromise = hashPassword('not-a-real-password-used-only-for-timing');
  }
  return dummyHashPromise;
}

export function toPublicUser(user: User) {
  // Never return passwordHash, failedLoginAttempts, lockedUntil, role, etc.
  // Only the minimal shape the frontend's User type needs.
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
}

async function issueTokenPair(user: Pick<User, 'id' | 'role'>, ip: string | undefined) {
  const refreshRecord = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      // Placeholder, replaced immediately below once we know the JWT's jti.
      tokenHash: 'pending',
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
      createdByIp: ip,
    },
  });

  const refreshToken = signRefreshToken({ sub: user.id, jti: refreshRecord.id });
  await prisma.refreshToken.update({
    where: { id: refreshRecord.id },
    data: { tokenHash: hashToken(refreshToken) },
  });

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  return { accessToken, refreshToken };
}

export async function register(input: { name: string; email: string; password: string }, ip?: string) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    // Deliberately generic — do not confirm which emails are already registered.
    throw AppError.conflict('Unable to create account with the provided details');
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      avatar: null,
    },
  });

  const tokens = await issueTokenPair(user, ip);
  return { user: toPublicUser(user), ...tokens };
}

export async function login(input: { email: string; password: string }, ip?: string) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (user?.lockedUntil && user.lockedUntil > new Date()) {
    // Still run a verify against the dummy hash so this path costs the same
    // as a normal failed attempt — do not short-circuit on lock status alone.
    await verifyPassword(await getDummyHash(), input.password);
    throw AppError.unauthorized('Invalid credentials');
  }

  const hashToCompare = user ? user.passwordHash : await getDummyHash();
  const passwordMatches = await verifyPassword(hashToCompare, input.password);

  if (!user || !passwordMatches) {
    if (user) {
      await registerFailedLoginAttempt(user.id, user.failedLoginAttempts);
    }
    throw AppError.unauthorized('Invalid credentials');
  }

  if (user.failedLoginAttempts > 0 || user.lockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });
  }

  const tokens = await issueTokenPair(user, ip);
  return { user: toPublicUser(user), ...tokens };
}

async function registerFailedLoginAttempt(userId: string, currentAttempts: number) {
  const attempts = currentAttempts + 1;
  const shouldLock = attempts >= env.LOGIN_LOCKOUT_MAX_ATTEMPTS;

  await prisma.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: attempts,
      lockedUntil: shouldLock ? new Date(Date.now() + env.LOGIN_LOCKOUT_MINUTES * 60 * 1000) : undefined,
    },
  });

  if (shouldLock) {
    logger.warn({ userId }, 'Account locked after repeated failed login attempts');
  }
}

export async function refresh(rawRefreshToken: string | undefined, ip?: string) {
  if (!rawRefreshToken) {
    throw AppError.unauthorized('Session expired, please log in again');
  }

  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw AppError.unauthorized('Session expired, please log in again');
  }

  const record = await prisma.refreshToken.findUnique({ where: { id: payload.jti } });

  if (!record || record.tokenHash !== hashToken(rawRefreshToken) || record.userId !== payload.sub) {
    throw AppError.unauthorized('Session expired, please log in again');
  }

  if (record.revokedAt || record.expiresAt < new Date()) {
    // Reuse of a revoked/expired refresh token is a strong signal of theft —
    // revoke the entire chain for this user as a precaution.
    if (record.revokedAt) {
      await revokeAllRefreshTokensForUser(record.userId);
      logger.warn({ userId: record.userId }, 'Reuse of a revoked refresh token detected — all sessions revoked');
    }
    throw AppError.unauthorized('Session expired, please log in again');
  }

  const user = await prisma.user.findUnique({ where: { id: record.userId } });
  if (!user) {
    throw AppError.unauthorized('Session expired, please log in again');
  }

  // Rotation: revoke the presented token, issue a brand new one.
  const newTokens = await issueTokenPair(user, ip);
  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { revokedAt: new Date() },
  });

  return { user: toPublicUser(user), ...newTokens };
}

export async function logout(rawRefreshToken: string | undefined) {
  if (!rawRefreshToken) return;
  try {
    const payload = verifyRefreshToken(rawRefreshToken);
    await prisma.refreshToken.updateMany({
      where: { id: payload.jti, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  } catch {
    // Token already invalid/expired — nothing to revoke, logout still "succeeds".
  }
}

async function revokeAllRefreshTokensForUser(userId: string) {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always behave identically whether or not the email exists — the caller
  // (route) always returns 202 regardless of this function's outcome.
  if (!user) return;

  const rawToken = generateOpaqueToken();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + env.PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000),
    },
  });

  // No email provider is wired up (would need third-party credentials this
  // repo doesn't have) — log it server-side only so it's usable in dev/testing.
  logger.info({ userId: user.id, resetToken: rawToken }, 'Password reset token issued (dev: no email provider configured)');
}

export async function resetPassword(rawToken: string, newPassword: string) {
  const tokenHash = hashToken(rawToken);
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw AppError.badRequest('Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    prisma.refreshToken.updateMany({ where: { userId: record.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
  ]);
}
