import express from "express";
import {
  createTerm,
  getAllTerms,
  getTermById,
  updateTerm,
  deleteTerm,
} from "../controllers/academictermController.js";

import { authenticateJWT, authorizeRoles } from "../middlewares/authJwt.js";

const router = express.Router();

// Only admin can create, update, delete terms
router.post("/", authenticateJWT, authorizeRoles("admin"), createTerm);
router.get("/", authenticateJWT, authorizeRoles("admin", "teacher"), getAllTerms);
router.get("/:id", authenticateJWT, authorizeRoles("admin", "teacher"), getTermById);
router.patch("/:id", authenticateJWT, authorizeRoles("admin"), updateTerm);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), deleteTerm);

export default router;
