import mongoose from "mongoose";

const violationSchema = new mongoose.Schema({
  masterAssetId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Asset', 
    required: true 
  },
  suspectUrl: { 
    type: String, 
    required: true 
  },
  pHashDistance: { 
    type: Number, 
    required: true 
  }, // Hamming distance to master asset
  confidence: { 
    type: Number, 
    required: true 
  },
  detectedAt: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['Open', 'Under Review', 'Takedown Issued', 'Resolved'], 
    default: 'Open' 
  },
  platform: { 
    type: String,
    default: 'Unknown'
  }, // e.g., 'Twitter', 'YouTube', 'Unknown'
  aiContext: { 
    type: String 
  } // Additional reasoning from GenAI
});

export default mongoose.model("Violation", violationSchema);
