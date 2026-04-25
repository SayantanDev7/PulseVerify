import Asset from '../models/Asset.js';
import { generatePHash } from '../services/hashService.js';

export const handleNewUpload = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const uploaderId = req.user.uid; // From auth middleware

    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required" });
    }

    // 1. Create a placeholder asset immediately so user isn't blocked
    const newAsset = await Asset.create({
      url: imageUrl,
      uploaderId,
      pHash: "processing...", // temporary
      aiAnalysis: {
        isOfficial: false,
        confidence: 0,
        reasoning: "Processing..."
      },
      status: 'Processing'
    });

    // 2. Respond immediately
    res.status(202).json({
      message: "Asset upload received and processing started.",
      asset: newAsset
    });

    // 3. Process AI and pHash asynchronously
    processAssetBackground(newAsset._id, imageUrl).catch(console.error);

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during upload" });
  }
};

const processAssetBackground = async (assetId, imageUrl) => {
  try {
    console.log(`Starting background processing for asset ${assetId}`);
    
    // Mock AI verification for simple prototype
    const aiReport = {
      isOfficial: true,
      confidence: 95,
      reasoning: "Mocked AI Report: Matched official jerseys despite crop."
    };

    // Run Hashing asynchronously
    const hash = await generatePHash(imageUrl).catch(err => {
      console.error("Hashing failed:", err);
      return "hash_failed";
    });

    // Update MongoDB
    await Asset.findByIdAndUpdate(assetId, {
      pHash: hash,
      aiAnalysis: {
        isOfficial: aiReport.isOfficial,
        confidence: aiReport.confidence,
        reasoning: aiReport.reasoning
      },
      status: aiReport.isOfficial ? 'Verified' : 'Flagged'
    });

    console.log(`Completed background processing for asset ${assetId}`);
  } catch (err) {
    console.error(`Background processing failed for asset ${assetId}:`, err);
    await Asset.findByIdAndUpdate(assetId, { status: 'Flagged' });
  }
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedDataPath = path.join(__dirname, '../data/seedData.json');

const getSeedData = () => {
  const data = fs.readFileSync(seedDataPath, 'utf-8');
  return JSON.parse(data);
};

export const getAllAssets = async (req, res) => {
  try {
    const seedData = getSeedData();
    // Inject mock _id and createdAt
    const assets = seedData.assets.map((asset, index) => ({
      ...asset,
      _id: `mock_asset_${index}`,
      createdAt: new Date().toISOString()
    }));
    res.status(200).json(assets);
  } catch (error) {
    console.error("Error reading seed data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAssetById = async (req, res) => {
  try {
    const seedData = getSeedData();
    const mockIndex = parseInt(req.params.id.replace('mock_asset_', '')) || 0;
    const asset = seedData.assets[mockIndex];
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    
    res.status(200).json({
      ...asset,
      _id: req.params.id,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error reading seed data:", error);
    res.status(500).json({ message: "Server error" });
  }
};