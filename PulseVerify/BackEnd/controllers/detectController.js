import Asset from '../models/Asset.js';
import Violation from '../models/Violation.js';
import { generatePHash, calculateHammingDistance } from '../services/hashService.js';
import admin from 'firebase-admin';

export const detectViolation = async (req, res) => {
  try {
    const { suspectUrl, platform } = req.body;

    if (!suspectUrl) {
      return res.status(400).json({ message: "suspectUrl is required" });
    }

    res.status(202).json({ message: "Detection scan started." });

    // Run asynchronously
    runDetectionBackground(suspectUrl, platform).catch(console.error);
    
  } catch (error) {
    console.error("Detection error:", error);
    res.status(500).json({ message: "Server error during detection" });
  }
};

const runDetectionBackground = async (suspectUrl, platform) => {
  try {
    console.log(`Scanning suspect URL: ${suspectUrl}`);
    const suspectHash = await generatePHash(suspectUrl);

    // Get all verified master assets
    // In a production system, you'd use a specialized vector DB or BK-Tree. 
    // For now, we do a linear scan since the DB is small.
    const masterAssets = await Asset.find({ status: 'Verified', pHash: { $ne: 'hash_failed' } });

    let bestMatch = null;
    let minDistance = Infinity;

    // Threshold for pHash similarity (usually <= 10 out of 64 bits is a good match for variations)
    const MATCH_THRESHOLD = 15;

    for (const asset of masterAssets) {
      try {
        const dist = calculateHammingDistance(suspectHash, asset.pHash);
        if (dist < minDistance && dist <= MATCH_THRESHOLD) {
          minDistance = dist;
          bestMatch = asset;
        }
      } catch (err) {
        // Skip comparing if hash lengths differ or there's an issue
        continue;
      }
    }

    if (bestMatch) {
      console.log(`Violation found! Matches master asset ${bestMatch._id} with distance ${minDistance}`);
      
      // Calculate a rough confidence score (0 distance = 100%, MATCH_THRESHOLD distance = ~70%)
      const confidence = Math.max(0, 100 - (minDistance * (30 / MATCH_THRESHOLD)));

      const newViolation = await Violation.create({
        masterAssetId: bestMatch._id,
        suspectUrl,
        pHashDistance: minDistance,
        confidence: confidence,
        platform: platform || 'Unknown',
        aiContext: "Matched via Perceptual Hash"
      });

      // 🔥 Real-time Push to Firestore AlertContext
      const db = admin.firestore();
      await db.collection('violations').doc(newViolation._id.toString()).set({
        ...newViolation.toObject(),
        detectedAt: admin.firestore.FieldValue.serverTimestamp(),
        masterAssetUrl: bestMatch.url // Send master URL for frontend UI display
      });

      console.log("Violation alert pushed to Firestore.");
    } else {
      console.log("No matching master assets found for the suspect URL.");
    }
  } catch (err) {
    console.error("Background detection failed:", err);
  }
};

export const getAllViolations = async (req, res) => {
  try {
    // We populate the masterAsset to get the original URL for comparison
    const violations = await Violation.find().populate('masterAssetId').sort({ detectedAt: -1 });
    res.status(200).json(violations);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching violations" });
  }
};