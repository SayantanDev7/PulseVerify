// Logic for hashing and AI analysis
import { verifySportsMedia } from '../services/aiService.js';

export const handleNewUpload = async (req, res) => {
  const { imageUrl } = req.body;
  
  // 1. Run AI analysis
  const aiReport = await verifySportsMedia(imageUrl);
  
  // 2. Save to MongoDB
  const newAsset = await Asset.create({
    url: imageUrl,
    isOfficial: aiReport.isOfficial,
    confidence: aiReport.confidence,
    aiReasoning: aiReport.reasoning
  });

  res.status(200).json(newAsset);
};