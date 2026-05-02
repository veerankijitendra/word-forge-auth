import { UserModel } from "./user.model";
import type { CreateUserInput } from "./user.schema";

export const createUser = async (input: CreateUserInput, profileImageUrl?: string) => {
  // In a real application, you should hash the password here before saving
  const user = await UserModel.create({
    ...input,
    role: "user",
    profilePhotoUrl: profileImageUrl,
  });

  // Return user without password
  const userResponse = user.toJSON();

  return userResponse;
};

export const findUsers = async () => {
  return await UserModel.find().select("-password");
};

export const deleteAllUsersService = async (): Promise<void> => {
  await UserModel.collection.drop();
};
