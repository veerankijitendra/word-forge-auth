import type { Request, Response } from "express";
import { createUser, deleteAllUsersService, findUsers } from "./user.service";
import type { CreateUserInput } from "./user.schema";
import { response } from "../../middlewares/response";
import { uploadProfileImageAsWebp } from "../../utils/image.util";

export const createUserController = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
) => {
  // const profileImageUrl = req.file
  //   ? (req.file as Express.Multer.File & { locaton: string }).location
  //   : undefined;

  const profileImageUrl = req.file ? await uploadProfileImageAsWebp(req.file) : undefined;
  const user = await createUser(req.body, profileImageUrl);

  res.status(201).json(response.success(user, "User created successfully"));
};

export const getUsersController = async (req: Request, res: Response) => {
  const users = await findUsers();
  res.status(200).json(response.success(users, "Users retrieved successfully"));
};

export const deleteAllUsersController = async (req: Request, res: Response) => {
  await deleteAllUsersService();
  res.status(200).json(response.success("Deleted successfully"));
};
