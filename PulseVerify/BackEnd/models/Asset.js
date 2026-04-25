import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  url: { 
    type: String, 
    required: true 
  },
  pHash: { 
    type: String, 
    required: true, 
    index: true 
  }, // Perceptual Hash for fingerprinting
  uploaderId: { 
    type: String, 
    required: true 
  }, // Firebase UID
  aiAnalysis: {
    isOfficial: { type: Boolean, required: true },
    confidence: { type: Number, required: true },
    reasoning: { type: String }
  },
  status: { 
    type: String, 
    enum: ['Processing', 'Verified', 'Flagged'], 
    default: 'Processing' 
  },
  metadata: {
    format: String,
    size: Number,
    league: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("Asset", assetSchema);
