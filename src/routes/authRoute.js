import express from "express";
import {
  login,
  createAdmin,
  createUser,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/authController.js";
import { authenticateJWT, authorizeRoles } from "../middlewares/authJwt.js";
import {
  loginSchema,
  createAdminSchema,
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
 
} from "../utils/validator.js";

import { validate } from "../middlewares/Validator.js";
const router = express.Router();

// ---------------- CREATE FIRST ADMIN ----------------
router.post("/create-admin", validate(createAdminSchema), createAdmin);

// ---------------- CREATE USER ----------------
router.post(
  "/create-user",
  authenticateJWT,
  authorizeRoles("admin"),
  validate(createUserSchema),
  createUser
);

// ---------------- LOGIN ----------------
router.post("/login", validate(loginSchema), login);

// ---------------- FORGOT PASSWORD ----------------
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

// ---------------- RESET PASSWORD ----------------
router.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword);

// ---------------- CHANGE PASSWORD ----------------
router.post(
  "/change-password",
  authenticateJWT,
  validate(changePasswordSchema),
  changePassword
);

export default router;
