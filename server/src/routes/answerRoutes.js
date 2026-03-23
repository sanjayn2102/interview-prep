import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { submitAnswer, evaluateSubmittedAnswer } from "../controllers/answerController.js";

const router = Router();

router.post("/", protect, submitAnswer);
router.post("/:id/evaluate", protect, evaluateSubmittedAnswer);

export default router;
