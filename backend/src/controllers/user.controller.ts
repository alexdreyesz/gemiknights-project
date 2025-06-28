import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
import User from "../models/user.model";
import {
  ILoginRequest,
  ILoginResponse,
  IUserResponse,
} from "../types/user.types";

// Helper function to convert User document to response format
const userToResponse = (user: any): IUserResponse => ({
  id: user._id.toString(),
  firstname: user.firstname,
  lastname: user.lastname,
  fullName: user.fullName,
  address: user.address,
  fullAddress: user.fullAddress,
  phoneNumber: user.phoneNumber,
  email: user.email,
  healthConditions: user.healthConditions,
  allergies: user.allergies,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// Generate JWT token
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

// Login user with email or phone number
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password }: ILoginRequest = req.body;

    // Validate input
    if (!identifier || !password) {
      res.status(400).json({
        error: "Email/phone number and password are required",
      });
      return;
    }

    // Find user by email or phone number
    const user = await (User as any).findByEmailOrPhone(identifier);

    if (!user) {
      res.status(401).json({
        error: "Invalid credentials",
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        error: "Invalid credentials",
      });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString());

    // Prepare response
    const userResponse = userToResponse(user);
    const loginResponse: ILoginResponse = {
      message: "Login successful",
      token,
      user: userResponse,
    };

    res.json(loginResponse);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Get current user profile (protected route)
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        error: "Authentication required",
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        error: "User not found",
      });
      return;
    }

    const userResponse = userToResponse(user);
    res.json({ user: userResponse });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
