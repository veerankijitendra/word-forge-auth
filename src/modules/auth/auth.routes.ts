import { Router } from "express";
import { LoginRequestSchema, RefreshTokenRequestSchema } from "@word-forge/schemas";

import { validateResource } from "../../middlewares/validateResource";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { loginController, refreshTokenController, logoutController } from "./auth.controller";
const router = Router();

router.post("/login", validateResource(LoginRequestSchema, "body"), asyncHandler(loginController));
router.post(
  "/logout",
  validateResource(RefreshTokenRequestSchema, "cookies"),
  asyncHandler(logoutController),
);
router.post(
  "/refresh-token",
  validateResource(RefreshTokenRequestSchema, "cookies"),
  asyncHandler(refreshTokenController),
);

export default router;
