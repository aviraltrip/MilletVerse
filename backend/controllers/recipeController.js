const Recipe = require('../models/Recipe');

// @desc    Get all approved recipes
// @route   GET /api/recipes
// @access  Public
exports.getRecipes = async (req, res) => {
  try {
    // Only fetch approved recipes for the public feed
    const recipes = await Recipe.find({ approvedStatus: true }).populate('createdBy', 'name');
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching recipes.' });
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'name');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching recipe details.' });
  }
};

// @desc    Create a recipe
// @route   POST /api/recipes
// @access  Private
exports.createRecipe = async (req, res) => {
  try {
    const { title, milletType, ingredients, steps, tags, cookTime, difficulty, healthLabels, nutritionalBreakdown, preparationNotes } = req.body;
    
    // Automatically set creator model based on role
    const creatorModel = req.user.role === 'expert' ? 'Expert' : 'User';
    const isExpertRecipe = req.user.role === 'expert';
    
    // Expert recipes can be auto-approved, or require admin approval. For now, auto-approve expert ones.
    const approvedStatus = req.user.role === 'expert' || req.user.role === 'admin';

    const newRecipe = new Recipe({
      title,
      milletType,
      ingredients,
      steps,
      tags,
      cookTime,
      difficulty,
      healthLabels,
      nutritionalBreakdown,
      preparationNotes,
      createdBy: req.user.id,
      creatorModel,
      isExpertRecipe,
      approvedStatus
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating recipe.' });
  }
};

// @desc    Get user's own recipes
// @route   GET /api/recipes/me
// @access  Private
exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id }).sort('-createdAt');
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching your recipes.' });
  }
};
