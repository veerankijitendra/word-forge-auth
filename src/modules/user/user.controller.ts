import type { Request, Response } from "express";
import { createUser, deleteAllUsersService, findUsers } from "./user.service";
import type { CreateUserInput } from "./user.schema";
import { response } from "../../middlewares/response";
import { uploadProfileImageAsWebp } from "../../utils/image.util";
import AuditLogger from "../../utils/logger/logger.auditLogger";

export const createUserController = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
) => {
  const profileImageUrl = req.file ? await uploadProfileImageAsWebp(req.file) : undefined;
  const user = await createUser(req.body, profileImageUrl);
  const { email, username } = user as { email: string; username: string };

  AuditLogger.info({
    req,
    handler: "createUserController",
    event: "user.createUser.success",
    message: "User create successfully",
    data: { username, email },
  });

  res.status(201).json(response.success(user, "User created successfully"));
};

export const getUsersController = async (req: Request, res: Response) => {
  const users = await findUsers();
  AuditLogger.info({
    req,
    handler: "getUsersController",
    event: "user.getUsers.success",
    message: "Users retrived successfully",
  });
  res.status(200).json(response.success(users, "Users retrieved successfully"));
};

export const deleteAllUsersController = async (req: Request, res: Response) => {
  await deleteAllUsersService();
  AuditLogger.info({
    req,
    handler: "deleteAllUsersController",
    event: "user.deleteAllUsers.success",
    message: "All users deleted successfully",
  });
  res.status(200).json(response.success("Deleted successfully"));
};
