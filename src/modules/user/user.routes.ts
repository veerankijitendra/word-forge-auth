import { Router } from 'express';
import { createUserController, getUsersController } from './user.controller';
import { validateResource } from '../../middlewares/validateResource';
import { createUserSchema } from './user.schema';
import { upload } from '../../middlewares/upload';

const router = Router();

// POST /api/users
// 1. Uploads the image (if 'profileImage' field is provided) via multer-s3
// 2. Validates the JSON body fields via Zod
// 3. Executes the controller logic
router.post(
  '/',
  upload.single('profileImage'),
  validateResource(createUserSchema),
  createUserController
);

// GET /api/users
router.get('/', getUsersController);

export default router;
