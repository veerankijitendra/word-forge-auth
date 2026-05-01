import { UserModel } from "../user/user.model";
import { AppError } from "../../utils/AppError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/token.utils";
import { hashRefreshToken } from "../../utils/auth.utils";

export const loginService = async (
  email: string,
  password: string,
  {
    device,
    ip,
  }: {
    device: string;
    ip: string | string[];
  },
): Promise<{ accessToken: string; refreshToken: string }> => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await UserModel.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const { _id, username, email: userEmail } = user.toJSON();
  const refreshToken = generateRefreshToken({ _id });
  const accessToken = generateAccessToken({ _id, email: userEmail, username });

  const expireTime = 7 * 24 * 60 * 60 * 1000;

  const now = new Date();

  user.refreshTokens = [
    ...(user.refreshTokens || []),
    {
      ip: Array.isArray(ip) ? ip[0] : ip,
      device,
      expiresAt: new Date(Date.now() + expireTime),
      token: hashRefreshToken(refreshToken),
      createdAt: now,
    },
  ]
    .filter((token) => token.expiresAt > now)
    .slice(-5);

  await user.save();

  return { accessToken, refreshToken };
};

export const logoutService = async (refreshToken: string) => {
  if (!refreshToken) throw new AppError("Invalid refresh token", 401);

  const payload = verifyRefreshToken(refreshToken);

  if (!payload) throw new AppError("Invalid refresh token", 401);

  const hashed = hashRefreshToken(refreshToken);

  const user = await UserModel.findById(payload._id).select("+refreshTokens.token");
  if (!user) throw new AppError("Invalid refresh token", 401);

  user.refreshTokens = user.refreshTokens.filter((token) => token.token !== hashed);
  await user.save();

  return;
};

export const refreshTokenService = async (
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const payload = verifyRefreshToken(refreshToken) as { _id: string } | null;

  if (!payload) throw new AppError("Invalid refresh token", 401);

  const hashed = hashRefreshToken(refreshToken);

  const user = (await UserModel.findOne({ _id: payload._id, "refreshTokens.token": hashed }).select(
    "+refreshTokens.token",
  )) as Awaited<ReturnType<typeof UserModel.findOne>> | null;

  if (!user) throw new AppError("Invalid refresh token", 401);

  const session = user.refreshTokens.find((ref) => ref.token === hashed);

  if (!session || session.expiresAt < new Date()) throw new AppError("Refresh token mismatch", 401);

  const { _id, email, username } = user.toJSON();
  const accessToken = generateAccessToken({ _id, email, username });
  const newRefreshToken = generateRefreshToken({ _id });

  const now = new Date();

  user.refreshTokens = [
    ...user.refreshTokens.filter((token) => token.token !== hashed),
    {
      ...session,
      token: hashRefreshToken(newRefreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  ]
    .filter((token) => token.expiresAt > now)
    .slice(-5);

  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
};
