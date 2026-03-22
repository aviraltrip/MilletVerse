const Expert = require('../models/Expert');
const Recipe = require('../models/Recipe');

// @desc    Get all experts
// @route   GET /api/experts
// @access  Public
exports.getExperts = async (req, res) => {
  try {
    const experts = await Expert.find({ approvedStatus: true }).select('-password');
    res.status(200).json(experts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching experts.' });
  }
};

// @desc    Get single expert with their recipes
// @route   GET /api/experts/:id
// @access  Public
exports.getExpertById = async (req, res) => {
  try {
    const expertId = req.params.id;
    const expert = await Expert.findById(expertId).select('-password');
    
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }
    
    // Also fetch recipes created by this expert
    const recipes = await Recipe.find({ createdBy: expertId, approvedStatus: true });

    res.status(200).json({ expert, recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching expert details.' });
  }
};
