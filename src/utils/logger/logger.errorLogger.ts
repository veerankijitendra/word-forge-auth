import type { AppError } from "../AppError";
import LoggerFactory from "./LoggerFactory";

class ErrorLogger {
  static logError(error: AppError, context = {}) {
    const logger = LoggerFactory.getLogger();
    const { name, message, statusCode, details, errorCode } = error;

    const errorLog: Record<string, unknown> = {
      name,
      message,
      statusCode,
      details,
      errorCode,
      ...context,
    };

    logger?.error(errorLog, "Application error occurred");
  }

  static logWarning(warning: string, context = {}) {
    const logger = LoggerFactory.getLogger();

    logger?.warn(
      {
        warning,
        ...context,
      },
      "Application warning occurred",
    );
  }
}

export default ErrorLogger;
