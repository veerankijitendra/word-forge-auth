import multer from "multer";
import type { Request } from "express";
import { AppError } from "../utils/AppError";

const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB max
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    if (allowedImageMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Please upload only JPEG, PNG, or WebP images.", 400, "INVALID_IMAGE_TYPE"));
    }
  },
});
