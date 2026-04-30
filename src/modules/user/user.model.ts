import mongoose, { Document, Schema } from 'mongoose';
import { CreateUserInput } from './user.schema';
import { comparePasswords, hashPassword } from '../../utils/password.util';

export type IUser = CreateUserInput &
  Document & {
    comparePassword: (candidatePassword: string) => Promise<boolean>;
  };

const RefreshTokenSchema = new Schema<CreateUserInput['refreshTokens'][0]>(
  {
    token: {
      type: String,
      required: true,
      select: false, // 👈 hides hashed token by default
    },
    device: {
      type: String,
    },
    ip: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiredAt: {
      type: Date,
      required: true,
    },
  },
  { _id: true },
);

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // Should be hashed in production
    lastName: { type: String, required: true },
    goal: { type: String, enum: ['student', 'exam', 'typing', 'professional'] },
    profilePhotoUrl: { type: String, default: '' },
    refreshTokens: [RefreshTokenSchema],
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

userSchema.pre('findOneAndUpdate', async function () {
  const update: any = this.getUpdate();

  if (update.password) {
    update.password = await hashPassword(update.password);
  }

  if (update.$set?.password) {
    update.$set.password = await hashPassword(update.$set.password);
  }
});

userSchema.set('toJSON', {
  transform: function (_, ret: any) {
    delete ret.password;
    delete ret.refreshTokens;
    return ret;
  },
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // Here you would compare the candidate password with the hashed password in the database
  // For demonstration, we'll just return true if they match exactly (which is NOT secure)
  // In production, you should use bcrypt.compare or a similar method to compare hashed passwords
  return await comparePasswords(candidatePassword, this.password!);
};

export const UserModel = mongoose.model<IUser>('User', userSchema);
