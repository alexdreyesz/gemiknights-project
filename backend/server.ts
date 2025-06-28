import express from "express";
import userRoutes from "./src/routes/user.routes.js"; // Add `.js` for ESM compatibility
import authRoutes from "./src/routes/auth.routes.js";

const app = express();
const port = 3000;

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
