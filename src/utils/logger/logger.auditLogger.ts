import { type Request } from "express";
import LoggerFactory from "./LoggerFactory";
class AuditLogger {
  static info(logs: {
    req: Request;
    event: string;
    handler: string;
    message: string;
    data?: Record<string, unknown>;
  }) {
    const { req, message, data, ...rest } = logs;
    const logger = LoggerFactory.createChildLogger({
      method: req.method,
      route: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      correlationId: req.headers["x-request-id"],
    });
    logger.info(
      {
        ...rest,
        ...(data || {}),
      },
      message,
    );
  }
}

export default AuditLogger;
