import { Router, Request, Response, RequestHandler } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import geminiService from "../services/gemini.service";

const router = Router();

// POST /api/emergency/analyze - Get AI analysis for emergency situation
router.post("/analyze", authenticateToken, (async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userName, healthConditions, allergies, emergencyType } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        error: "Authentication required",
      });
      return;
    }

    // Validate input
    if (
      !userName ||
      !Array.isArray(healthConditions) ||
      !Array.isArray(allergies)
    ) {
      res.status(400).json({
        error: "User name, health conditions and allergies must be provided",
      });
      return;
    }

    // Get AI summary from Gemini
    const summary = await geminiService.generateEmergencySummary(
      userName,
      healthConditions,
      allergies,
      emergencyType || "Medical Emergency"
    );

    res.json({
      message: "Emergency summary generated successfully",
      summary,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating emergency summary:", error);
    res.status(500).json({
      error: "Failed to generate emergency summary",
    });
  }
}) as RequestHandler);

export default router;
