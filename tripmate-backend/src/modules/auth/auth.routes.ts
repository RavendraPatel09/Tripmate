import { Router } from 'express';
import { asyncHandler } from '@/middleware/asyncHandler';
import { validate } from '@/middleware/validate';
import { requireAuth } from '@/middleware/auth';
import {
  loginRateLimiter,
  registerRateLimiter,
  refreshRateLimiter,
  forgotPasswordRateLimiter,
} from '@/middleware/rateLimiters';
import { setRefreshTokenCookie, clearRefreshTokenCookie, getRefreshTokenFromRequest } from '@/lib/cookies';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.schemas';
import * as authService from './auth.service';

export const authRouter = Router();

authRouter.post(
  '/register',
  registerRateLimiter,
  validate({ body: registerSchema }),
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password }, req.ip);
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(201).json({ user: result.user, accessToken: result.accessToken });
  }),
);

authRouter.post(
  '/login',
  loginRateLimiter,
  validate({ body: loginSchema }),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login({ email, password }, req.ip);
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json({ user: result.user, accessToken: result.accessToken });
  }),
);

authRouter.post(
  '/refresh',
  refreshRateLimiter,
  asyncHandler(async (req, res) => {
    const rawRefreshToken = getRefreshTokenFromRequest(req.cookies ?? {});
    const result = await authService.refresh(rawRefreshToken, req.ip);
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json({ user: result.user, accessToken: result.accessToken });
  }),
);

authRouter.post(
  '/logout',
  asyncHandler(async (req, res) => {
    const rawRefreshToken = getRefreshTokenFromRequest(req.cookies ?? {});
    await authService.logout(rawRefreshToken);
    clearRefreshTokenCookie(res);
    res.status(204).send();
  }),
);

authRouter.post(
  '/forgot-password',
  forgotPasswordRateLimiter,
  validate({ body: forgotPasswordSchema }),
  asyncHandler(async (req, res) => {
    await authService.forgotPassword(req.body.email);
    // Always the same response, regardless of whether the email exists.
    res.status(202).json({ message: 'If that email is registered, a reset link has been sent.' });
  }),
);

authRouter.post(
  '/reset-password',
  forgotPasswordRateLimiter,
  validate({ body: resetPasswordSchema }),
  asyncHandler(async (req, res) => {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    res.status(200).json({ message: 'Password has been reset. Please log in.' });
  }),
);

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    // req.user was already re-fetched from the DB by requireAuth this request —
    // just re-shape it to the minimal public fields (no role, no internal ids).
    const { id, name, email, avatar } = req.user!;
    res.status(200).json({ user: { id, name, email, avatar } });
  }),
);
