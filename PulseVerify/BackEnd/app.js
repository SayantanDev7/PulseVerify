import 'dotenv/config';
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/authRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import detectionRoutes from "./routes/detectionRoutes.js";
import comparisonRoutes from "./routes/comparisonRoutes.js";

const app = express();

// ── CORS ────────────────────────────────────────────────────────────────────
// Allow the React dev servers on 3000/5173/5174 AND production Vercel
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174", "https://pulse-verify.vercel.app"];

app.set("trust proxy", 1); // Required for secure cookies behind Render's proxy

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// ── Session & Body parsers ──────────────────────────────────────────────────
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './config/passport.js'; // Ensure passport config is loaded

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'pulseverify_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true on Render
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // none required for cross-domain
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ── Static uploads folder ───────────────────────────────────────────────────
// Serves files from BackEnd/uploads/ at http://localhost:5000/uploads/<filename>
// Real user uploads will be accessible here after multer saves them.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health check ────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ success: true, message: "PulseVerify API is running.", timestamp: new Date().toISOString() });
});

// ── API Routes ──────────────────────────────────────────────────────────────
app.use("/auth", authRoutes); // Auth routes should be at /auth to match the callback URL
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
