import mongoose, { type Document, Schema } from "mongoose";
import type { CreateUserInput } from "./user.schema";
import { comparePasswords, hashPassword } from "../../utils/password.util";

export type IUser = CreateUserInput &
  Document & {
    comparePassword: (candidatePassword: string) => Promise<boolean>;
  };

const RefreshTokenSchema = new Schema<CreateUserInput["refreshTokens"][0]>(
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
    goal: { type: String, enum: ["student", "exam", "typing", "professional"] },
    profilePhotoUrl: { type: String, default: "" },
    refreshTokens: [RefreshTokenSchema],
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    // Here you would hash the password before saving to the database
    // For demonstration, we'll just leave it as is
    const hashed = await hashPassword(this.password);
    this.password = hashed;
  }
});

userSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate() as Record<string, unknown>;

  if (update.password) {
    update.password = await hashPassword(update.password as string);
  }

  if (update.$set && typeof update.$set === "object" && "password" in update.$set) {
    (update.$set as Record<string, unknown>).password = await hashPassword(
      (update.$set as Record<string, unknown>).password as string,
    );
  }
});

userSchema.set("toJSON", {
  transform: function (_, ret) {
    delete (ret as { password?: string }).password;
    delete (ret as { refreshTokens?: unknown[] }).refreshTokens;
    return ret;
  },
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // Here you would compare the candidate password with the hashed password in the database
  return await comparePasswords(candidatePassword, this.password as string);
};

export const UserModel = mongoose.model<IUser>("User", userSchema);
