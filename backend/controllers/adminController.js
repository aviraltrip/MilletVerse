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

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort('-createdAt');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users.' });
  }
};

// @desc    Get all experts
// @route   GET /api/admin/experts
// @access  Private/Admin
exports.getAllExperts = async (req, res) => {
  try {
    const experts = await Expert.find().select('-password').sort('-createdAt');
    res.status(200).json(experts);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching experts.' });
  }
};

// @desc    Create new expert
// @route   POST /api/admin/experts
// @access  Private/Admin
exports.createExpert = async (req, res) => {
  try {
    const { name, email, password, specialty, credentials, bio } = req.body;
    
    const existingExpert = await Expert.findOne({ email });
    if (existingExpert) {
      return res.status(400).json({ message: 'Expert with this email already exists' });
    }

    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const expert = new Expert({
      name,
      email,
      password: hashedPassword,
      specialty,
      credentials,
      bio,
      approvedStatus: true // Admin created experts are auto-approved
    });

    await expert.save();
    res.status(201).json({ message: 'Expert created successfully', expert: { id: expert._id, name: expert.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating expert.' });
  }
};

// @desc    Update expert
// @route   PUT /api/admin/experts/:id
// @access  Private/Admin
exports.updateExpert = async (req, res) => {
  try {
    const { name, email, specialty, credentials, bio, password } = req.body;
    const updateData = { name, email, specialty, credentials, bio };
    
    if (password) {
      const bcrypt = require('bcrypt');
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const expert = await Expert.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!expert) return res.status(404).json({ message: 'Expert not found' });
    
    res.status(200).json(expert);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating expert.' });
  }
};

// @desc    Delete expert
// @route   DELETE /api/admin/experts/:id
// @access  Private/Admin
exports.deleteExpert = async (req, res) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) return res.status(404).json({ message: 'Expert not found' });
    res.status(200).json({ message: 'Expert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting expert.' });
  }
};
