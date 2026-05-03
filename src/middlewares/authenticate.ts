import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "./asyncHandler";
import { verifyAccessToken } from "../utils/token.utils";
import { AppError } from "../utils/AppError";

type AuthenticatedRequest = Request & { user?: Record<string, unknown> };

export const authenticate = asyncHandler(
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized", 401, "NOT_AUTHORIZED");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Invalid token", 401, "INVALID_TOKEN");
    }

    const decodedToken = verifyAccessToken(token);

    if (!decodedToken) {
      throw new AppError("Invalid or expired token", 401, "INVALID_TOKEN");
    }

    req.user = decodedToken;

    next();
  },
);
