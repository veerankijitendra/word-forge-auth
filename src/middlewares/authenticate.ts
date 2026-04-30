import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "./asyncHandler";
import { verifyAccessToken } from "../utils/token.utils";
import { response } from "./response";

type AuthenticatedRequest = Request & { user?: Record<string, unknown> };

export const authenticate = asyncHandler(
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Here you would typically check for a valid access token in the Authorization header
    // For demonstration, we'll just check if the header exists and is in the format "Bearer <token>"
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json(response.error("Unauthorized"));
    }

    const token = authHeader.split(" ")[1];
    // Here you would verify the token and extract user information
    // For demonstration, we'll just attach a dummy user to the request object

    if (!token) {
      return res.status(401).json(response.error("Invalid token"));
    }

    const decodedToken = verifyAccessToken(token);

    if (!decodedToken) {
      return res.status(401).json(response.error("Invalid or expired token"));
    }

    req.user = decodedToken;

    next();
  },
);
