import Asset from '../models/Asset.js';
import { generatePHash } from '../services/hashService.js';
import { verifySportsMedia } from '../services/aiService.js';

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
    
    // Run AI verification and Hashing in parallel
    const [aiReport, hash] = await Promise.all([
      verifySportsMedia(imageUrl),
      generatePHash(imageUrl).catch(err => {
        console.error("Hashing failed:", err);
        return "hash_failed";
      })
    ]);

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

export const getAllAssets = async (req, res) => {
  try {
    // Only return assets belonging to the user
    const assets = await Asset.find({ uploaderId: req.user.uid }).sort({ createdAt: -1 });
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findOne({ _id: req.params.id, uploaderId: req.user.uid });
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};