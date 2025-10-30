import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  resetUserPassword,
} from "../controllers/userController.js";

import { authenticateJWT, authorizeRoles } from "../middlewares/authJwt.js";

const router = express.Router();

// ---------------- USER ROUTES ----------------

// Get all users (admin only)
router.get("/", authenticateJWT, authorizeRoles("admin"), getAllUsers);

// Get single user by ID (admin only)
router.get("/:id", authenticateJWT, authorizeRoles("admin"), getUserById);

// Update user info (admin only)
router.patch("/:id", authenticateJWT, authorizeRoles("admin"), updateUser);

// Delete user (admin only)
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), deleteUser);

// Reset user password (admin only)
router.post("/:id/reset-password", authenticateJWT, authorizeRoles("admin"), resetUserPassword);

export default router;
