import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Asset from '../models/Asset.js';
import { generatePHash } from '../services/hashService.js';

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

// ── Helper: format seed assets consistently ──────────────────────────────────
const formatSeedAssets = () => {
  const seedData = getSeedData();
  return seedData.assets.map((asset, index) => ({
    ...asset,
    _id: `seed_asset_${index}`,
    _isSeed: true,
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  }));
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/assets
// Returns a **merged** array: real MongoDB assets + demo seed data.
// The seed data provides a rich prototype UI; real uploads appear alongside.
// ─────────────────────────────────────────────────────────────────────────────
export const getAllAssets = async (_req, res) => {
  try {
    let dbAssets = [];

    if (isDbConnected()) {
      dbAssets = await Asset.find().sort({ createdAt: -1 }).lean();
    }

    // Always include seed data so the demo looks populated
    const seedAssets = formatSeedAssets();

    // Real user uploads first, then seed data
    const merged = [...dbAssets, ...seedAssets];

    return res.status(200).json(merged);
  } catch (error) {
    console.error("Error in getAllAssets:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch assets." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/assets/:id
// Returns a single asset by ID (supports both MongoDB ObjectIds and seed IDs).
// ─────────────────────────────────────────────────────────────────────────────
export const getAssetById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try MongoDB first
    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const asset = await Asset.findById(id).lean();
      if (asset) return res.status(200).json(asset);
    }

    // Seed data fallback
    const seedData = getSeedData();
    const seedIndex = parseInt(id.replace('seed_asset_', ''), 10);
    const asset = seedData.assets[isNaN(seedIndex) ? 0 : seedIndex];

    if (!asset) {
      return res.status(404).json({ success: false, message: "Asset not found." });
    }

    return res.status(200).json({
      ...asset,
      _id: id,
      _isSeed: true,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in getAssetById:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch asset." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/assets/upload
// Creates a new asset record. Falls back to an in-memory mock when DB is down.
// ─────────────────────────────────────────────────────────────────────────────
export const handleNewUpload = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const uploaderId = req.user?.uid || 'anonymous';

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "imageUrl is required." });
    }

    if (isDbConnected()) {
      const newAsset = await Asset.create({
        url: imageUrl,
        uploaderId,
        pHash: "processing...",
        aiAnalysis: { isOfficial: false, confidence: 0, reasoning: "Processing..." },
        status: 'Processing',
      });

      res.status(202).json({
        success: true,
        message: "Asset upload received and processing started.",
        asset: newAsset,
      });

      // Fire-and-forget background processing
      processAssetBackground(newAsset._id, imageUrl).catch(console.error);
    } else {
      // Mock response when DB is offline
      const mockAsset = {
        _id: `mock_${Date.now()}`,
        url: imageUrl,
        uploaderId,
        pHash: "mock_hash",
        aiAnalysis: { isOfficial: true, confidence: 95, reasoning: "Mock analysis — DB offline." },
        status: 'Verified',
        createdAt: new Date().toISOString(),
      };
      return res.status(202).json({
        success: true,
        message: "Asset received (seed-data mode).",
        asset: mockAsset,
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ success: false, message: "Server error during upload." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/assets/:id
// Updates an existing asset. Only works for real (non-seed) assets.
// ─────────────────────────────────────────────────────────────────────────────
export const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;

    if (id.startsWith('seed_asset_')) {
      return res.status(403).json({ success: false, message: "Cannot modify demo assets." });
    }

    if (!isDbConnected() || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid asset ID." });
    }

    const updated = await Asset.findByIdAndUpdate(id, req.body, { new: true, lean: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Asset not found." });
    }

    return res.status(200).json({ success: true, asset: updated });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ success: false, message: "Failed to update asset." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/assets/:id
// Deletes an asset. Only works for real (non-seed) assets.
// ─────────────────────────────────────────────────────────────────────────────
export const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;

    if (id.startsWith('seed_asset_')) {
      return res.status(403).json({ success: false, message: "Cannot delete demo assets." });
    }

    if (!isDbConnected() || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid asset ID." });
    }

    const deleted = await Asset.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Asset not found." });
    }

    return res.status(200).json({ success: true, message: "Asset deleted." });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete asset." });
  }
};

// ── Background processor ─────────────────────────────────────────────────────
const processAssetBackground = async (assetId, imageUrl) => {
  try {
    console.log(`Starting background processing for asset ${assetId}`);

    const aiReport = {
      isOfficial: true,
      confidence: 95,
      reasoning: "Mocked AI Report: Matched official jerseys despite crop.",
    };

    const hash = await generatePHash(imageUrl).catch((err) => {
      console.error("Hashing failed:", err);
      return "hash_failed";
    });

    await Asset.findByIdAndUpdate(assetId, {
      pHash: hash,
      aiAnalysis: aiReport,
      status: aiReport.isOfficial ? 'Verified' : 'Flagged',
    });

    console.log(`Completed background processing for asset ${assetId}`);
  } catch (err) {
    console.error(`Background processing failed for asset ${assetId}:`, err);
    await Asset.findByIdAndUpdate(assetId, { status: 'Flagged' }).catch(() => {});
  }
};