import type { Request, Response, NextFunction } from "express";
import { normalizerError } from "../utils/handleError";
import { response } from "./response";
import ErrorLogger from "../utils/logger/logger.errorLogger";

// Global error handler
export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const error = normalizerError(err);

  ErrorLogger.logError(error, {
    method: req.method,
    route: req.originalUrl, // full route
    query: req.query,
    params: req.params,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    correlationId: (req.headers["x-request-id"] as string) || undefined,
  });

  res
    .status(error.statusCode || 500)
    .json(response.error(error.message, error.details, error.stack));
};
