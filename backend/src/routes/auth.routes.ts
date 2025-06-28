import { Router } from "express";
import { login, getProfile } from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// POST /api/auth/login - Login with email/phone and password
router.post("/login", login);

// GET /api/auth/profile - Get current user profile (protected)
router.get("/profile", authenticateToken, getProfile);

export default router;
