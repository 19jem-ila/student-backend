import express from "express";
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";

import { authenticateJWT, authorizeRoles } from "../middlewares/authJwt.js";

const router = express.Router();

// Only admin can create, update, delete classes
router.post("/", authenticateJWT, authorizeRoles("admin"), createClass);
router.get("/", authenticateJWT, authorizeRoles("admin", "teacher"), getAllClasses);
router.get("/:id", authenticateJWT, authorizeRoles("admin", "teacher"), getClassById);
router.patch("/:id", authenticateJWT, authorizeRoles("admin"), updateClass);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), deleteClass);

export default router;
