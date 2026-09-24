import { NextFunction, Request, Response } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { verifyAccessToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/AppError';
import { asyncHandler } from '@/middleware/asyncHandler';

export interface AuthenticatedUser {
  id: string;
  role: 'USER' | 'ADMIN';
  email: string;
  name: string;
  avatar: string | null;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
}

// Server-side authentication, re-verified on every protected request:
//   1. Verify the JWT signature + expiry (never trust an unverified token).
//   2. Re-fetch the user (and therefore role) from the DB — the token's own
//      `role` claim is NEVER used for authorization decisions, only its
//      subject (`sub`) is trusted, so a role change/ban takes effect
//      immediately instead of waiting for the token to expire.
export const requireAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractBearerToken(req);
  if (!token) {
    throw AppError.unauthorized('Authentication required');
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw AppError.unauthorized('Session expired');
    }
    if (err instanceof JsonWebTokenError) {
      throw AppError.unauthorized('Invalid session');
    }
    throw err;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, avatar: true, role: true },
  });

  if (!user) {
    // User deleted after the token was issued — do not trust the stale token.
    throw AppError.unauthorized('Invalid session');
  }

  req.user = user;
  next();
});

// Optional auth: attaches req.user if a valid token is present, but never
// rejects the request. Used for routes that are public but personalize the
// response when logged in (none currently required, kept for future catalog
// endpoints that may want to merge per-user state without gating access).
export const attachUserIfPresent = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractBearerToken(req);
  if (!token) {
    next();
    return;
  }
  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, avatar: true, role: true },
    });
    if (user) req.user = user;
  } catch {
    // Invalid/expired token on an optional-auth route: proceed unauthenticated
    // rather than rejecting — this route is public by design.
  }
  next();
});
