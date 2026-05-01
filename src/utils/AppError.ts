export class AppError extends Error {
  statusCode: number;
  isOperation: boolean;
  errorCode?: string;
  details?: Record<string, unknown>;

  constructor(message: string, statusCode: number = 500, errorCode?: string, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperation = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
