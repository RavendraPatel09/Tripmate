import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from '@/config/env';
import { logger } from '@/lib/logger';
import { requestId } from '@/middleware/requestId';
import { generalApiRateLimiter } from '@/middleware/rateLimiters';
import { notFoundHandler } from '@/middleware/notFound';
import { errorHandler } from '@/middleware/errorHandler';
import { apiRouter } from '@/routes';
import { AppError } from '@/utils/AppError';

export function createApp(): Express {
  const app = express();

  // Behind a reverse proxy (Docker/most PaaS) so `req.ip` / `secure` cookies
  // reflect the real client, not the proxy hop.
  app.set('trust proxy', 1);

  app.use(requestId);

  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => (req as unknown as { requestId: string }).requestId,
      autoLogging: !env.isTest,
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
    }),
  );

  // Standard security headers.
  app.use(helmet());

  // Explicit allow-list only — never `*` with credentials enabled.
  app.use(
    cors({
      origin(origin, callback) {
        // Same-origin / non-browser requests (curl, server-to-server) have no
        // Origin header — allow those through; browsers always send Origin
        // for cross-site requests, which is what this check actually guards.
        if (!origin || env.corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    }),
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));

  app.use(generalApiRateLimiter);

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api', apiRouter);

  app.use(notFoundHandler);

  // CORS rejection surfaces as a generic thrown Error — normalize it into our
  // AppError shape instead of letting Express's default HTML error page leak.
  app.use((err: unknown, _req: Request, _res: Response, next: NextFunction) => {
    if (err instanceof Error && err.message === 'Not allowed by CORS') {
      next(AppError.forbidden('Origin not allowed'));
      return;
    }
    next(err);
  });

  app.use(errorHandler);

  return app;
}
