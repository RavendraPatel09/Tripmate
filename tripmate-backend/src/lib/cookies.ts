import { Response } from 'express';
import { env } from '@/config/env';

const REFRESH_COOKIE_NAME = 'refreshToken';

export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'strict',
    domain: env.COOKIE_DOMAIN || undefined,
    path: '/api/auth',
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'strict',
    domain: env.COOKIE_DOMAIN || undefined,
    path: '/api/auth',
  });
}

export function getRefreshTokenFromRequest(cookies: Record<string, string | undefined>): string | undefined {
  return cookies[REFRESH_COOKIE_NAME];
}
