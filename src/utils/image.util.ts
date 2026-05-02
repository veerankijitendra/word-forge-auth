import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { env } from "../config/env";

import { s3Client } from "../config/s3";
import { AppError } from "./AppError";

const PROFILE_IMAGE_SIZE = 513;
const WEBP_QUALITY = 80;

const baseS3Url = (key: string): string => {
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");

  return `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${encodedKey}`;
};

export const uploadProfileImageAsWebp = async (file: Express.Multer.File) => {
  if (!file.buffer) {
    throw new AppError("Profile image file is missing", 400, "PROFILE_IMAGE_MISSING");
  }

  const webpBuffer = await sharp(file.buffer)
    .rotate()
    .resize(PROFILE_IMAGE_SIZE, PROFILE_IMAGE_SIZE, { fit: "cover", position: "center" })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  const key = `uploads/profile-images/profileImage-${uniqueSuffix}.webp`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: webpBuffer,
      ContentType: "image/webp",
    }),
  );

  return baseS3Url(key);
};
