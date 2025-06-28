import { Router } from "express";
// Ensure the correct path to the user model
import User from "../models/user.model";

const router = Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, address, phone, email, conditions, allergies } =
    req.body;

  if (!firstName || !lastName || !address || !phone) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const newUser = await User.create({
      firstName,
      lastName,
      address,
      phone,
      email,
      conditions,
      allergies,
    });

    console.log("User registered:", newUser);
    res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser._id });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Internal server error");
  }
});

export default router;
