import type { Request, Response, NextFunction } from "express";
import { type LoginRequest } from "@word-forge/schemas";
import { response } from "../../middlewares/response";
import { loginService, logoutService, refreshTokenService } from "./auth.service";
import { AppError } from "../../utils/AppError";
import { getDeviceInfo, getIp } from "../../utils/auth.utils";

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

  res
    .cookie("refreshToken", refreshToken, refreshCookieSetOptions)
    .header("Authorization", `Bearer ${accessToken}`)
    .status(200)
    .json(response.success({ accessToken }, "Login successful"));
};

export const logoutController = async (req: Request, res: Response, _next: NextFunction) => {
  const { refreshToken } = req.cookies as { refreshToken: string };

  await logoutService(refreshToken);

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
