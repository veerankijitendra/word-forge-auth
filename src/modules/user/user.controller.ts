import { Request, Response, NextFunction } from 'express';
import { createUser, findUsers } from './user.service';
import { CreateUserInput } from './user.schema';

export const createUserController = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profileImageUrl = req.file ? (req.file as any).location : undefined;

    const user = await createUser(req.body, profileImageUrl);

    res.status(201).json({
      status: 'success',
      data: { user },
    });
  } catch (error: any) {
    // Handle mongoose duplicate key error specifically if needed, otherwise pass to global handler
    if (error.code === 11000) {
      return res.status(409).json({ status: 'error', message: 'Email already exists' });
    }
    next(error);
  }
};

export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await findUsers();
    res.status(200).json({
      status: 'success',
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};
