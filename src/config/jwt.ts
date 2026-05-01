import type { StringValue } from "ms";

export const jwtConfig = {
  refreshSecret: process.env.JWT_REFRESH_SECRET!,
  accessSecret: process.env.JWT_ACCESS_SECRET!,
  algorithm: process.env.JWT_ALGORITHM || "HS256",
  accessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as StringValue,
  refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as StringValue,
};
