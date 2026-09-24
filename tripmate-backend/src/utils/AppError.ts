// A deliberately "boring" operational-error type: every field on it is safe
// to send to a client as-is. Anything NOT modeled as an AppError is treated
// by the central error handler as an unexpected 500 and gets a fully generic
// body — see middleware/errorHandler.ts.
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly clientMessage: string;
  public readonly isOperational = true;
  // Only ever populated with safe, pre-vetted field-level validation messages
  // (see middleware/validate.ts) — never raw internals, stack traces, or SQL.
  public details?: Array<{ field: string; message: string }>;

  constructor(statusCode: number, clientMessage: string) {
    super(clientMessage);
    this.statusCode = statusCode;
    this.clientMessage = clientMessage;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Invalid request'): AppError {
    return new AppError(400, message);
  }

  static unauthorized(message = 'Authentication required'): AppError {
    return new AppError(401, message);
  }

  static forbidden(message = 'You do not have permission to perform this action'): AppError {
    return new AppError(403, message);
  }

  static notFound(message = 'Resource not found'): AppError {
    return new AppError(404, message);
  }

  static conflict(message = 'Resource already exists'): AppError {
    return new AppError(409, message);
  }

  static tooManyRequests(message = 'Too many requests, please try again later'): AppError {
    return new AppError(429, message);
  }

  static internal(message = 'Something went wrong'): AppError {
    return new AppError(500, message);
  }
}
