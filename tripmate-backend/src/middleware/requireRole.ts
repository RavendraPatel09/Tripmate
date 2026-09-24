import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/utils/AppError';

// Applied ONCE at the router level (see modules/admin/admin.routes.ts) — never
// scattered per-controller. Must run AFTER requireAuth, which re-fetches the
// user's role from the DB on every request; this middleware only reads that
// already-verified `req.user.role`. Admin status is never accepted from a
// client-supplied header/body/query field.
export function requireRole(...allowedRoles: Array<'USER' | 'ADMIN'>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      // Defensive: should be unreachable if requireAuth runs first.
      throw AppError.unauthorized('Authentication required');
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw AppError.forbidden('You do not have permission to perform this action');
    }
    next();
  };
}
