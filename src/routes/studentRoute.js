import express from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";
import { authenticateJWT, authorizeRoles } from "../middlewares/authJwt.js";

const router = express.Router();

// ---------------- STUDENT ROUTES ----------------

// Only admins and teachers can manage students
router.post("/", authenticateJWT, authorizeRoles("admin", "teacher"), createStudent);
router.get("/", authenticateJWT, authorizeRoles("admin", "teacher"), getAllStudents);
router.get("/:id", authenticateJWT, authorizeRoles("admin", "teacher"), getStudentById);
router.patch("/:id", authenticateJWT, authorizeRoles("admin", "teacher"), updateStudent);
router.delete("/:id", authenticateJWT, authorizeRoles("admin", "teacher"), deleteStudent);

export default router;
