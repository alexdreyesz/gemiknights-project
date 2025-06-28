import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/database";
import userRoutes from "./src/routes/user.routes";
import authRoutes from "./src/routes/auth.routes";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Vite default port
    credentials: true,
  })
);

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
