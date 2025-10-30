import express from "express";
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

import { authenticateJWT, authorizeRoles } from "../middlewares/authJwt.js";

const router = express.Router();

// ---------------- SUBJECT ROUTES ----------------
// Only admin can manage subjects
router.post("/", authenticateJWT, authorizeRoles("admin"), createSubject);
router.get("/", authenticateJWT, authorizeRoles("admin", "teacher"), getAllSubjects);
router.get("/:id", authenticateJWT, authorizeRoles("admin", "teacher"), getSubjectById);
router.patch("/:id", authenticateJWT, authorizeRoles("admin"), updateSubject);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), deleteSubject);

export default router;
