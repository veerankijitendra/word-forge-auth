import type { Request, Response, NextFunction } from "express";
import { type LoginRequest } from "@word-forge/schemas";
import { response } from "../../middlewares/response";
import { loginService, logoutService, refreshTokenService } from "./auth.service";
import { AppError } from "../../utils/AppError";
import { getDeviceInfo, getIp } from "../../utils/auth.utils";
import AuditLogger from "../../utils/logger/logger.auditLogger";

const expireTime = 7 * 24 * 60 * 60 * 1000;

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

const refreshCookieSetOptions = {
  ...refreshCookieOptions,
  maxAge: expireTime,
};

export const loginController = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response,
  _next: NextFunction,
) => {
  const { email, password } = req.body;

  const device = getDeviceInfo(req);
  const ip = getIp(req);

  const { accessToken, refreshToken } = await loginService(email, password, {
    device,
    ip: Array.isArray(ip) ? ip[0] : ip,
  });

  AuditLogger.info({
    req,
    data: { email, ip, device },
    event: "auth.login.success",
    handler: "loginController",
    message: "Login successfull",
  });

  res
    .cookie("refreshToken", refreshToken, refreshCookieSetOptions)
    .status(200)
    .json(response.success({ accessToken }, "Login successful"));
};

export const logoutController = async (req: Request, res: Response, _next: NextFunction) => {
  const { refreshToken } = req.cookies as { refreshToken: string };

  await logoutService(refreshToken);

  AuditLogger.info({
    req,
    event: "auth.logout.success",
    handler: "logoutController",
    message: "Logout successfull",
  });

  res.clearCookie("refreshToken", refreshCookieOptions);

  res.status(200).json(response.success(null, "Logout successful"));
};

export const refreshTokenController = async (req: Request, res: Response, _next: NextFunction) => {
  const { refreshToken } = req.cookies as { refreshToken: string };

  if (!refreshToken) throw new AppError("Invalid refresh token", 401);

  const { accessToken, refreshToken: newRefreshToken } = await refreshTokenService(refreshToken);
  res
    .cookie("refreshToken", newRefreshToken, refreshCookieSetOptions)
    .header("Authorization", `Bearer ${accessToken}`)
    .status(200)
    .json(response.success({ accessToken }, "Token refreshed successfully"));
};
