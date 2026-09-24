import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodTypeAny } from 'zod';
import { AppError } from '@/utils/AppError';

// ZodTypeAny (not AnyZodObject) so `.strict().refine(...)` schemas — which
// are ZodEffects, not ZodObject — still type-check here.
interface ValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

// Mandatory validation gate: every route that touches the DB or business logic
// validates body/query/params with Zod BEFORE any handler code runs.
// `.strict()` schemas reject unknown fields (mass-assignment protection).
export function validate(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body ?? {});
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query ?? {}) as typeof req.query;
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params ?? {}) as typeof req.params;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // Client-facing message stays generic/structured; never leak the raw
        // Zod internals (they can be verbose) — just field + issue.
        const details = err.issues.map((issue) => ({
          field: issue.path.join('.') || '(root)',
          message: issue.message,
        }));
        const error = AppError.badRequest('Invalid request data');
        error.details = details;
        next(error);
        return;
      }
      next(err);
    }
  };
}
