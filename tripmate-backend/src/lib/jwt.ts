import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { env } from '@/config/env';

export interface AccessTokenPayload {
  sub: string; // user id
  role: 'USER' | 'ADMIN';
  tokenVersion?: number;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string; // refresh token id (matches RefreshToken.id in DB)
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: `${env.ACCESS_TOKEN_TTL_MINUTES}m`,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  // Throws on invalid signature, tampering, or expiry — callers must catch.
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`,
  });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}

// Refresh tokens (and password-reset tokens) are stored in the DB as a SHA-256
// hash, never in plaintext — a leaked DB dump alone can't be replayed as a
// live session, matching the "stored hashed... with rotation + revocation"
// requirement.
export function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export function generateOpaqueToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
