import { ZodError } from "zod";
import { AppError } from "./AppError";

export const normalizerError = (error: any) => {
    if (error instanceof AppError) {
        return error;
    }

    if (error instanceof ZodError) {
        return new AppError("Invalid input", 400, "INVALID_INPUT", error.issues);
    }

    if (error.code && error.code === 11000) {
        return new AppError("Resource already exists", 400, "RESOURCE_ALREADY_EXISTS", error.keyValue);
    }

    // ✅ JWT errors
    if (error.name === 'JsonWebTokenError') {
        return new AppError('Invalid token', 401, 'INVALID_TOKEN');
    }

    if (error.name === 'TokenExpiredError') {
        return new AppError('Token expired', 401, 'TOKEN_EXPIRED');
    }


    return new AppError(error.message || "Something went wrong", error.statusCode || 500, "INTERNAL_ERROR", error.message);
}
