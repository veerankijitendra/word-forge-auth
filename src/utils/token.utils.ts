import { sign, verify, type Algorithm, type SignOptions, type JwtPayload } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { AppError } from "./AppError";

export const generateAccessToken = (payload: object): string => {
  const options: SignOptions = {
    algorithm: jwtConfig.algorithm as Algorithm,
    expiresIn: jwtConfig.accessExpiresIn,
  };
  return sign(payload, jwtConfig.accessSecret, options);
};

export const generateRefreshToken = (payload: object): string => {
  const options: SignOptions = {
    algorithm: jwtConfig.algorithm as Algorithm,
    expiresIn: jwtConfig.refreshExpiresIn,
  };
  return sign(payload, jwtConfig.refreshSecret, options);
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    const decoded = verify(token, jwtConfig.accessSecret, {
      algorithms: [jwtConfig.algorithm as Algorithm],
    });

    if (typeof decoded === "string") {
      throw new AppError("Invalid access token"); // We expect the payload to be an object, not a string. If it's a string, return null.
    }
    return decoded;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    const decoded = verify(token, jwtConfig.refreshSecret, {
      algorithms: [jwtConfig.algorithm as Algorithm],
    });

    if (typeof decoded === "string") {
      throw new AppError("Invalid refresh token"); // We expect the payload to be an object, not a string. If it's a string, return null.
    }
    return decoded;
  } catch {
    return null;
  }
};
