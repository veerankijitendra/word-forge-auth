import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3Client } from '../config/s3';
import { env } from '../config/env';
import path from 'path';
import { Request } from 'express';

export const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `uploads/${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB max
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'));
    }
  },
});
