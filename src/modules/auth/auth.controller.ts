import { Request, Response, NextFunction } from 'express';
import { LoginRequest } from '@word-forge/schemas';
import { UserModel } from '../user/user.model';
import { AppError } from '../../utils/AppError';
import { response } from '../../middlewares/response';
import { generateAccessToken, generateRefreshToken } from '../../utils/token.utils';

export const loginController = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email', 401);
  }

  const isMatch = await user.comparePassword!(password);

  if (!isMatch) {
    throw new AppError('Invalid password', 401);
  }

  const { _id, username } = user.toJSON();
  const refreshToken = generateRefreshToken({ _id });
  const accessToken = generateAccessToken({ _id, email, username });

  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .header('Authorization', `Bearer ${accessToken}`)
    .status(200)
    .json(response.success({ accessToken }, 'Login successful'));
};

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  // Here you would typically verify the refresh token and issue a new access token
  // For demonstration, we'll just return a success message

  res.status(200).json({ message: 'Token refreshed successfully' });
};
