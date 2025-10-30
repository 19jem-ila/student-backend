import express from "express";
import {
  createGrade,
  getAllGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
} from "../controllers/gradeController.js";

import { authenticateJWT, authorizeRoles } from "../middlewares/authJwt.js";

const router = express.Router();

// ---------------- GRADE ROUTES ----------------
// Only admins and teachers can manage grades
router.post("/", authenticateJWT, authorizeRoles("teacher"), createGrade);
router.get("/", authenticateJWT, authorizeRoles("admin", "teacher"), getAllGrades);
router.get("/:id", authenticateJWT, authorizeRoles("admin", "teacher"), getGradeById);
router.patch("/:id", authenticateJWT, authorizeRoles("teacher"), updateGrade);
router.delete("/:id", authenticateJWT, authorizeRoles("teacher"), deleteGrade);

export default router;
