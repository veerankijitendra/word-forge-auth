import { ZodError } from "zod";
import { AppError } from "./AppError";

export const normalizerError = (error: unknown) => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof ZodError) {
    return new AppError("Invalid input", 400, "INVALID_INPUT", { issues: error.issues });
  }

  if (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    "keyValue" in error &&
    (error as { code: number }).code === 11000
  ) {
    return new AppError(
      "Resource already exists",
      400,
      "RESOURCE_ALREADY_EXISTS",
      (error as { keyValue: Record<string, unknown> }).keyValue,
    );
  }

  // ✅ JWT errors
  if (
    error !== null &&
    typeof error === "object" &&
    "name" in error &&
    (error as { name: string }).name === "JsonWebTokenError"
  ) {
    return new AppError("Invalid token", 401, "INVALID_TOKEN");
  }

  if (
    error !== null &&
    typeof error === "object" &&
    "name" in error &&
    (error as { name: string }).name === "TokenExpiredError"
  ) {
    return new AppError("Token expired", 401, "TOKEN_EXPIRED");
  }

  return new AppError(
    (error instanceof Error ? error.message : undefined) || "Something went wrong",
    500,
    "INTERNAL_ERROR",
    error instanceof Error ? { message: error.message } : undefined,
  );
};
