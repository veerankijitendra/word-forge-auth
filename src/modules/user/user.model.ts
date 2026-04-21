import mongoose, { Document, Schema } from 'mongoose';
import { CreateUserInput } from './user.schema';
import { comparePasswords, hashPassword } from '../../utils/password.util';

type IUser = CreateUserInput &
  Document & {
    comparePassword?: (candidatePassword: string) => Promise<boolean>;
  };

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

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    // Here you would hash the password before saving to the database
    // For demonstration, we'll just leave it as is
    const hashed = await hashPassword(this.password!);
    this.password = hashed;
  }
});

userSchema.set('toJSON', {
  transform: function (_, ret: any) {
    delete ret.password;
    delete ret.refreshToken;
    return ret;
  },
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // Here you would compare the candidate password with the hashed password in the database
  // For demonstration, we'll just return true if they match exactly (which is NOT secure)
  // In production, you should use bcrypt.compare or a similar method to compare hashed passwords
  console.log('Comparing passwords:', candidatePassword, JSON.stringify(this));
  return await comparePasswords(candidatePassword, this.password!);
};

export const UserModel = mongoose.model<IUser>('User', userSchema);
