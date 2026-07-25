/**
 * @file: routes/auth.js
 * @description: Defines the authentication API routes and maps each one 
 * to its controller, applying the protect middleware where a valid 
 * session is required.
*/

import express from "express";
import {
    register,
    login, 
    me,
    updateProfile
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.put("/profile", protect, updateProfile);

export default router;