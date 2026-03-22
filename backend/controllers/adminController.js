const User = require('../models/User');
const Expert = require('../models/Expert');
const Recipe = require('../models/Recipe');
const HealthLog = require('../models/HealthLog');

// @desc    Get system analytics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalExperts = await Expert.countDocuments();
    const pendingExperts = await Expert.countDocuments({ approvedStatus: false });
    const totalRecipes = await Recipe.countDocuments();
    const pendingRecipes = await Recipe.countDocuments({ approvedStatus: false });
    const totalHealthLogs = await HealthLog.countDocuments();

    // Recent signups
    const recentUsers = await User.find({ role: 'user' }).sort('-createdAt').limit(5).select('-password');
    const recentExperts = await Expert.find().sort('-createdAt').limit(5).select('-password');

    res.status(200).json({
      metrics: {
        totalUsers,
        totalExperts,
        pendingExperts,
        totalRecipes,
        pendingRecipes,
        totalHealthLogs
      },
      recentUsers,
      recentExperts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching admin stats.' });
  }
};

// @desc    Approve an expert
// @route   PUT /api/admin/experts/:id/approve
// @access  Private/Admin
exports.approveExpert = async (req, res) => {
  try {
    const expert = await Expert.findByIdAndUpdate(req.params.id, { approvedStatus: true }, { new: true }).select('-password');
    res.status(200).json(expert);
  } catch (error) {
    res.status(500).json({ message: 'Server error approving expert.' });
  }
};

// @desc    Approve a recipe
// @route   PUT /api/admin/recipes/:id/approve
// @access  Private/Admin
exports.approveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, { approvedStatus: true }, { new: true });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Server error approving recipe.' });
  }
};

// @desc    Get pending experts
// @route   GET /api/admin/pending-experts
// @access  Private/Admin
exports.getPendingExperts = async (req, res) => {
  try {
    const experts = await Expert.find({ approvedStatus: false }).select('-password');
    res.status(200).json(experts);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching pending experts.' });
  }
};

// @desc    Get pending recipes
// @route   GET /api/admin/pending-recipes
// @access  Private/Admin
exports.getPendingRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ approvedStatus: false }).populate('createdBy', 'name');
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching pending recipes.' });
  }
};
