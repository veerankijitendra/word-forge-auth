import mongoose, { Document, Schema } from 'mongoose';
import { CreateUserInput } from './user.schema';

type IUser = CreateUserInput & Document;

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Should be hashed in production
    lastName: { type: String, required: true },
    goal: { type: String, enum: ['student', 'exam', 'typing', 'professional'] },
    profilePhotoUrl: { type: String, default: '' },
    refreshToken: { type: String, select: false }, // For authentication purposes
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<IUser>('User', userSchema);
