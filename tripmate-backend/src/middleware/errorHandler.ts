import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '@/utils/AppError';
import { logger } from '@/lib/logger';

// Centralized error handler. This is the ONLY place that decides what an
// error looks like on the wire. Rules, no exceptions:
//   - Known/operational errors (AppError) -> their own safe status + message.
//   - Everything else (bugs, DB errors, unhandled exceptions) -> generic 500
//     `{ error: "Something went wrong" }`.
//   - Full error detail (message, stack, Prisma error, etc.) goes ONLY to the
//     server log, tagged with the same requestId returned to the client, in
//     BOTH development and production — there is no "verbose in dev" escape
//     hatch, by design (see SECURITY_CHECKLIST.md item 4).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const requestId = req.requestId;

  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, requestId }, 'Operational 5xx error');
    } else {
      logger.warn({ err: err.message, requestId, path: req.path }, 'Handled client error');
    }
    res.status(err.statusCode).json({
      error: err.clientMessage,
      ...(err.details ? { details: err.details } : {}),
      requestId,
    });
    return;
  }

  // Malformed request body (bad JSON) is a client error, not a server bug —
  // still only a generic message, never the parser's raw complaint.
  if (err instanceof SyntaxError && 'body' in err) {
    logger.warn({ requestId, path: req.path }, 'Malformed request body');
    res.status(400).json({ error: 'Invalid request body', requestId });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error({ err, code: err.code, meta: err.meta, requestId }, 'Prisma known request error');
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'Resource already exists', requestId });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Resource not found', requestId });
      return;
    }
    res.status(500).json({ error: 'Something went wrong', requestId });
    return;
  }

  // Anything unmodeled: log full detail server-side, return only a generic
  // message + correlation id to the client. Never `err.message` or `err.stack`.
  logger.error({ err, requestId }, 'Unhandled error');
  res.status(500).json({ error: 'Something went wrong', requestId });
}
