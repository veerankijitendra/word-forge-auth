import { Router } from 'express';
import { createUserController, getUsersController } from './user.controller';
import { validateResource } from '../../middlewares/validateResource';
import { createUserSchema } from './user.schema';
import { upload } from '../../middlewares/upload';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

// POST /api/users
// 1. Uploads the image (if 'profileImage' field is provided) via multer-s3
// 2. Validates the JSON body fields via Zod
// 3. Executes the controller logic
router.post(
  '/',
  upload.single('profileImage'),
  validateResource(createUserSchema, 'body'),
  asyncHandler(createUserController),
);

// GET /api/users
router.get('/', authenticate, getUsersController);

export default router;
