import { NextFunction, Request, Response } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redis } from '@/lib/redis';
import { AppError } from '@/utils/AppError';
import { logger } from '@/lib/logger';

function buildLimiter(keyPrefix: string, points: number, durationSeconds: number) {
  const limiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix,
    points,
    duration: durationSeconds,
  });

  return (req: Request, _res: Response, next: NextFunction) => {
    // Keyed by IP. Auth endpoints below ALSO key the DB-level account lockout
    // by email (see auth.service.ts), so a distributed brute-force attempt
    // against a single account is throttled even from many source IPs.
    const key = req.ip ?? 'unknown';
    limiter
      .consume(key)
      .then(() => next())
      .catch(() => {
        logger.warn({ ip: req.ip, path: req.path }, 'Rate limit exceeded');
        next(AppError.tooManyRequests('Too many requests, please try again later'));
      });
  };
}

// Brute-force protection on auth endpoints — deliberately tighter than the
// general API limiter.
export const loginRateLimiter = buildLimiter('rl:login', 10, 60);
export const registerRateLimiter = buildLimiter('rl:register', 5, 60 * 10);
export const refreshRateLimiter = buildLimiter('rl:refresh', 20, 60);
export const forgotPasswordRateLimiter = buildLimiter('rl:forgot-password', 5, 60 * 10);
export const aiGeneratorRateLimiter = buildLimiter('rl:ai-generate', 20, 60);

// Coarse, generous limiter for the whole API surface as defense in depth.
export const generalApiRateLimiter = buildLimiter('rl:general', 300, 60);
