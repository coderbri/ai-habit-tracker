/**
 * @file: routes/ai.js
 * @description: Express routing for AI insight and analysis endpoints.
 */
import express from "express";
import {
    weeklyReport,
    suggestHabits,
    recoveryPlan,
    chatAnalysis,
    morningMotivation,
} from "../controllers/aiController.js"
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Require JWT authentication for all log routes
router.use(protect);

router.post("/weekly-report", weeklyReport);
router.post("/suggest-habits", suggestHabits);
router.post("/recovery-plan", recoveryPlan);
router.post("/chat", chatAnalysis);
router.get("/morning", morningMotivation);

export default router;