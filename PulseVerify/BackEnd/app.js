import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import detectionRoutes from "./routes/detectionRoutes.js";
import comparisonRoutes from "./routes/comparisonRoutes.js";

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173", // default vite port
  credentials: true
}));
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.send("PulseVerify API is running.");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/violations", detectionRoutes);
app.use("/api/comparisons", comparisonRoutes);

export default app;
