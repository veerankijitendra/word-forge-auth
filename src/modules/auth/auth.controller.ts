import { Request, Response, NextFunction } from 'express';
import { LoginRequest } from '@word-forge/schemas';
import { UserModel } from '../user/user.model';

export const loginController = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  res.status(200).json({ message: 'Login successful', email });
};

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  // Here you would typically verify the refresh token and issue a new access token
  // For demonstration, we'll just return a success message

  res.status(200).json({ message: 'Token refreshed successfully' });
};
