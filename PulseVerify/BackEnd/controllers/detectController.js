import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Asset from '../models/Asset.js';
import Violation from '../models/Violation.js';
import { generatePHash, calculateHammingDistance } from '../services/hashService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedDataPath = path.join(__dirname, '../data/seedData.json');

// ── Helper: read seed data safely ───────────────────────────────────────────
const getSeedData = () => {
  const data = fs.readFileSync(seedDataPath, 'utf-8');
  return JSON.parse(data);
};

// ── Helper: check if MongoDB is connected ────────────────────────────────────
const isDbConnected = () => mongoose.connection.readyState === 1;

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/violations
// Returns all detected violations with coordinates for the World Map.
// Falls back to seed data when MongoDB is unavailable.
// ─────────────────────────────────────────────────────────────────────────────
export const getAllViolations = async (_req, res) => {
  try {
    let violations;

    if (isDbConnected()) {
      const dbViolations = await Violation.find().sort({ detectedAt: -1 }).lean();
      if (dbViolations.length > 0) {
        violations = dbViolations;
      }
    }

    // Fallback to seed data
    if (!violations || violations.length === 0) {
      const seedData = getSeedData();
      violations = seedData.violations.map((violation, index) => {
        const masterIndex = index % seedData.assets.length;
        const masterAsset = seedData.assets[masterIndex];

        return {
          ...violation,
          _id: `seed_violation_${index}`,
          masterAssetId: `seed_asset_${masterIndex}`,
          masterAssetUrl: masterAsset.url,
          // Ensure lat/lng and similarityScore are present for the World Map & Gauges
          lat: violation.coordinates?.[1] ?? 0,
          lng: violation.coordinates?.[0] ?? 0,
          similarityScore: violation.confidence,
          detectedAt: new Date(Date.now() - index * 3600000 * 6).toISOString(),
        };
      });
    }

    return res.status(200).json(violations);
  } catch (error) {
    console.error("Error in getAllViolations:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch violations." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/violations/:id
// Returns a detailed comparison object between a pirated clip and its master.
// Used by the Evidence Board for side-by-side analysis.
// ─────────────────────────────────────────────────────────────────────────────
export const getViolationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try MongoDB first
    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const violation = await Violation.findById(id).lean();
      if (violation) {
        // Enrich with master asset data
        const masterAsset = await Asset.findById(violation.masterAssetId).lean().catch(() => null);
        return res.status(200).json({
          ...violation,
          masterAssetUrl: masterAsset?.url ?? violation.masterAssetUrl,
          masterMetadata: masterAsset?.metadata ?? {},
          masterPHash: masterAsset?.pHash ?? "unknown",
          comparison: {
            pHashDistance: violation.pHashDistance,
            confidence: violation.confidence,
            aiContext: violation.aiContext,
            platform: violation.platform,
            coordinates: violation.coordinates,
            country: violation.country,
            city: violation.city,
          },
        });
      }
    }

    // Seed data fallback
    const seedData = getSeedData();
    const seedIndex = parseInt(id.replace('seed_violation_', ''), 10);
    const idx = isNaN(seedIndex) ? 0 : seedIndex;
    const violation = seedData.violations[idx];

    if (!violation) {
      return res.status(404).json({ success: false, message: "Violation not found." });
    }

    const masterIndex = idx % seedData.assets.length;
    const masterAsset = seedData.assets[masterIndex];

    return res.status(200).json({
      ...violation,
      _id: id,
      masterAssetId: `seed_asset_${masterIndex}`,
      masterAssetUrl: masterAsset.url,
      masterMetadata: masterAsset.metadata,
      masterPHash: masterAsset.pHash,
      lat: violation.coordinates?.[1] ?? 0,
      lng: violation.coordinates?.[0] ?? 0,
      similarityScore: violation.confidence,
      detectedAt: new Date().toISOString(),
      comparison: {
        pHashDistance: violation.pHashDistance,
        confidence: violation.confidence,
        aiContext: violation.aiContext,
        platform: violation.platform,
        coordinates: violation.coordinates,
        country: violation.country,
        city: violation.city,
      },
    });
  } catch (error) {
    console.error("Error in getViolationById:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch violation details." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/violations/detect
// Starts a detection scan against a suspect URL.
// ─────────────────────────────────────────────────────────────────────────────
export const detectViolation = async (req, res) => {
  try {
    const { suspectUrl, platform } = req.body;

    if (!suspectUrl) {
      return res.status(400).json({ success: false, message: "suspectUrl is required." });
    }

    // For prototype: respond immediately with mock detection
    return res.status(200).json({
      success: true,
      message: "Detection scan started.",
      mocked: true,
      status: "Processing",
    });
  } catch (error) {
    console.error("Detection error:", error);
    return res.status(500).json({ success: false, message: "Server error during detection." });
  }
};