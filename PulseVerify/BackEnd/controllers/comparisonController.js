import Violation from "../models/Violation.js";

// @route   GET /api/comparisons
// @desc    Get all comparisons (violations)
// @access  Private
export const getAllComparisons = async (req, res) => {
  try {
    const comparisons = await Violation.find().sort({ detectedAt: -1 });
    res.status(200).json(comparisons);
  } catch (error) {
    console.error("Error fetching comparisons:", error);
    res.status(500).json({ message: "Server error while fetching comparisons" });
  }
};

// @route   GET /api/comparisons/:id
// @desc    Get specific comparison by ID
// @access  Private
export const getComparisonById = async (req, res) => {
  try {
    const { id } = req.params;
    const comparison = await Violation.findById(id);
    
    if (!comparison) {
      return res.status(404).json({ message: "Comparison not found" });
    }

    res.status(200).json(comparison);
  } catch (error) {
    console.error("Error fetching comparison by ID:", error);
    res.status(500).json({ message: "Server error while fetching comparison" });
  }
};
