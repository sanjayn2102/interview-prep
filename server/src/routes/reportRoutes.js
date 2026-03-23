import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getSessionReport } from "../controllers/reportController.js";

const router = Router();

router.get("/:id/report", protect, getSessionReport);

export default router;
