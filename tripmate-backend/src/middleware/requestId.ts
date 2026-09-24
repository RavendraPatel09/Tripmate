import { randomUUID } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

// Every request gets a correlation id. It's safe to return to the client
// (it's an opaque UUID, not an internal detail) and lets us tie a generic
// "Something went wrong" response back to the full error in server logs.
export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = randomUUID();
  req.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
}
