import express from "express";
import {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.js";

import { authenticateJWT, authorizeRoles } from "../middlewares/authJwt.js";

const router = express.Router();

// ---------------- ATTENDANCE ROUTES ----------------

// Only admins and teachers can manage attendance
router.post("/", authenticateJWT, authorizeRoles("admin", "teacher"), createAttendance);
router.get("/", authenticateJWT, authorizeRoles("admin", "teacher"), getAllAttendance);
router.get("/:id", authenticateJWT, authorizeRoles("admin", "teacher"), getAttendanceById);
router.patch("/:id", authenticateJWT, authorizeRoles("admin", "teacher"), updateAttendance);
router.delete("/:id", authenticateJWT, authorizeRoles("admin", "teacher"), deleteAttendance);

export default router;
