import type { Request, Response, NextFunction } from "express";
import { createUser, findUsers } from "./user.service";
import type { CreateUserInput } from "./user.schema";
import { response } from "../../middlewares/response";

export const createUserController = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
) => {
  // const profileImageUrl = req.file
  //   ? (req.file as Express.Multer.File & { locaton: string }).location
  //   : undefined;

  const profileImageUrl = req.file
    ? (req.file as Express.Multer.File & { location: string }).location
    : undefined;
  const user = await createUser(req.body, profileImageUrl);

  res.status(201).json(response.success(user, "User created successfully"));
};

export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await findUsers();
    res.status(200).json(response.success(users, "Users retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
