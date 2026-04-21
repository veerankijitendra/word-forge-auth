import { Request, Response, NextFunction } from 'express';
import { createUser, findUsers } from './user.service';
import { CreateUserInput } from './user.schema';
import { response } from '../../middlewares/response';

export const createUserController = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction,
) => {
  const profileImageUrl = req.file ? (req.file as any).location : undefined;
  const user = await createUser(req.body, profileImageUrl);

  res.status(201).json(response.success(user, 'User created successfully'));
};

export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await findUsers();
    res.status(200).json(response.success(users, 'Users retrieved successfully'));
  } catch (error) {
    next(error);
  }
};
