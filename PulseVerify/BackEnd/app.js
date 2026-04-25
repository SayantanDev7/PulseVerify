import 'dotenv/config';
import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import detectionRoutes from "./routes/detectionRoutes.js";
import comparisonRoutes from "./routes/comparisonRoutes.js";

const app = express();

// ── CORS ────────────────────────────────────────────────────────────────────
// Allow the React dev servers on 3000/5173/5174 AND any custom CORS_ORIGIN
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// ── Body parser ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));

// ── Health check ────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ success: true, message: "PulseVerify API is running.", timestamp: new Date().toISOString() });
});

// ── API Routes ──────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/violations", detectionRoutes);
app.use("/api/comparisons", comparisonRoutes);

// ── 404 catch-all ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ── Global error handler ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

export default app;
