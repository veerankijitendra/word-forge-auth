import mongoose, { type Document, Schema } from "mongoose";
import { z } from "zod";
import type { CreateUserInput } from "./user.schema";
import { comparePasswords, hashPassword } from "../../utils/password.util";

const _RefreshTokensSchema = z
  .array(
    z.object({
      token: z.string().min(1, "Token is required"),
      device: z.string().optional(),
      ip: z.string().optional(),
      createdAt: z.coerce.date().default(() => new Date()),
      expiresAt: z.coerce.date(),
    }),
  )
  .default([]);

const _UserRoleSchema = z.enum(["admin", "user"]);

type UserRoleType = z.infer<typeof _UserRoleSchema>;

type RefreshTokensType = z.infer<typeof _RefreshTokensSchema>;

export type IUser = CreateUserInput &
  Document & {
    refreshTokens: RefreshTokensType;
    role: UserRoleType;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
  };

const RefreshTokenSchema = new Schema<RefreshTokensType[0]>(
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
    expiresAt: {
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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
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
