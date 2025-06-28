import { Router, Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
// Ensure the correct path to the user model
import User from "../models/user.model";
import { ICreateUser, IUpdateUser, IUserResponse } from "../types/user.types";

const router = Router();

// Generate JWT token
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

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

// POST /api/users - Create a new user (Registration)
router.post("/", (async (req: Request, res: Response) => {
  try {
    const userData: ICreateUser = req.body;

    // Validate required fields
    const requiredFields = [
      "firstname",
      "lastname",
      "address",
      "phoneNumber",
      "password",
    ];
    const missingFields = requiredFields.filter(
      (field) => !userData[field as keyof ICreateUser]
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields,
      });
    }

    // Validate address structure
    if (
      !userData.address.street ||
      !userData.address.city ||
      !userData.address.state ||
      !userData.address.zipCode
    ) {
      return res.status(400).json({
        error:
          "Invalid address structure. Required: street, city, state, zipCode. Optional: building, apartment",
      });
    }

    const newUser = await User.create(userData);
    const userResponse = userToResponse(newUser);

    // Generate JWT token
    const token = generateToken(newUser._id.toString());

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userResponse,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        error: "User with this email already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.message,
      });
    }

    res.status(500).json({
      error: "Internal server error",
    });
  }
}) as RequestHandler);

// GET /api/users - Get all users with optional filtering
router.get("/", (async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      healthCondition,
      allergy,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query: any = {};

    // Search functionality
    if (search) {
      query.$or = [
        { firstname: { $regex: search as string, $options: "i" } },
        { lastname: { $regex: search as string, $options: "i" } },
        { email: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = { [sortBy as string]: sortOrder === "desc" ? -1 : 1 };

    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    const usersResponse = users.map(userToResponse);

    res.json({
      users: usersResponse,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalUsers: total,
        hasNextPage: skip + users.length < total,
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}) as RequestHandler);

// GET /api/users/:id - Get user by ID
router.get("/:id", (async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const userResponse = userToResponse(user);
    res.json({ user: userResponse });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}) as RequestHandler);

// PUT /api/users/:id - Update user
router.put("/:id", (async (req: Request, res: Response) => {
  try {
    const updateData: IUpdateUser = req.body;

    // Validate address structure if provided
    if (updateData.address) {
      const addressFields = ["street", "city", "state", "zipCode"];
      const missingAddressFields = addressFields.filter(
        (field) =>
          !updateData.address![field as keyof typeof updateData.address]
      );

      if (missingAddressFields.length > 0) {
        return res.status(400).json({
          error: "Invalid address structure",
          missingFields: missingAddressFields,
        });
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const userResponse = userToResponse(user);
    res.json({
      message: "User updated successfully",
      user: userResponse,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        error: "User with this email already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.message,
      });
    }

    res.status(500).json({
      error: "Internal server error",
    });
  }
}) as RequestHandler);

// DELETE /api/users/:id - Delete user
router.delete("/:id", (async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}) as RequestHandler);

// POST /api/users/:id/health-conditions - Add health condition
router.post("/:id/health-conditions", (async (req: Request, res: Response) => {
  try {
    const { condition } = req.body;

    if (!condition || typeof condition !== "string") {
      return res.status(400).json({
        error: "Health condition is required and must be a string",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await user.addHealthCondition(condition);
    const userResponse = userToResponse(user);

    res.json({
      message: "Health condition added successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error adding health condition:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}) as RequestHandler);

// DELETE /api/users/:id/health-conditions/:condition - Remove health condition
router.delete("/:id/health-conditions/:condition", (async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await user.removeHealthCondition(req.params.condition);
    const userResponse = userToResponse(user);

    res.json({
      message: "Health condition removed successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error removing health condition:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}) as RequestHandler);

// POST /api/users/:id/allergies - Add allergy
router.post("/:id/allergies", (async (req: Request, res: Response) => {
  try {
    const { allergy } = req.body;

    if (!allergy || typeof allergy !== "string") {
      return res.status(400).json({
        error: "Allergy is required and must be a string",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await user.addAllergy(allergy);
    const userResponse = userToResponse(user);

    res.json({
      message: "Allergy added successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error adding allergy:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}) as RequestHandler);

// DELETE /api/users/:id/allergies/:allergy - Remove allergy
router.delete("/:id/allergies/:allergy", (async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await user.removeAllergy(req.params.allergy);
    const userResponse = userToResponse(user);

    res.json({
      message: "Allergy removed successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error removing allergy:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}) as RequestHandler);

export default router;
