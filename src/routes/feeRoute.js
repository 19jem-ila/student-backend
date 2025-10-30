import express from "express";
import {
  createFee,
  getAllFees,
  getFeeById,
  updateFee,
  deleteFee,
} from "../controllers/feeController.js";
import { authenticateJWT, authorizeRoles } from "../middlewares/authJwt.js";

const router = express.Router();

// ---------------- FEE ROUTES ----------------
// Only admins and teachers can manage fees
router.post("/", authenticateJWT, authorizeRoles("admin"), createFee);
router.get("/", authenticateJWT, authorizeRoles("admin"), getAllFees);
router.get("/:id", authenticateJWT, authorizeRoles("admin"), getFeeById);
router.patch("/:id", authenticateJWT, authorizeRoles("admin"), updateFee);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), deleteFee);

export default router;
