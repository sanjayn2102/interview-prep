import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createSession,
  getSessions,
  generateSessionQuestions,
  getSessionQuestions
} from "../controllers/sessionController.js";

const router = Router();

router.post("/", protect, createSession);
router.get("/", protect, getSessions);
router.post("/:id/generate-questions", protect, generateSessionQuestions);
router.get("/:id/questions", protect, getSessionQuestions);

export default router;
