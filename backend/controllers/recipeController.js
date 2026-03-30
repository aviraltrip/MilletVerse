const Recipe = require('../models/Recipe');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

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
    const { title, milletType, ingredients, steps, tags, cookTime, difficulty, healthLabels, nutritionalBreakdown, preparationNotes, image } = req.body;

    const parseMaybeJson = (value, fallback) => {
      if (value === undefined || value === null || value === '') return fallback;
      if (typeof value !== 'string') return value;
      try {
        return JSON.parse(value);
      } catch {
        return fallback;
      }
    };

    const parsedIngredients = parseMaybeJson(ingredients, []);
    const parsedSteps = parseMaybeJson(steps, []);
    const parsedTags = parseMaybeJson(tags, []);
    const parsedHealthLabels = parseMaybeJson(healthLabels, []);
    const parsedNutritionalBreakdown = parseMaybeJson(nutritionalBreakdown, {});

    // Optional image upload (multipart -> cloudinary)
    let imageUrl = image;
    if (req.file?.buffer) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'recipe_images', resource_type: 'image' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        Readable.from(req.file.buffer).pipe(uploadStream);
      });

      imageUrl = uploadResult?.secure_url;
    }
    
    // Automatically set creator model based on role
    const creatorModel = req.user.role === 'expert' ? 'Expert' : 'User';
    const isExpertRecipe = req.user.role === 'expert';
    
    // Expert recipes can be auto-approved, or require admin approval. For now, auto-approve expert ones.
    const approvedStatus = req.user.role === 'expert' || req.user.role === 'admin';

    const newRecipe = new Recipe({
      title,
      milletType,
      ingredients: parsedIngredients,
      steps: parsedSteps,
      tags: parsedTags,
      cookTime: Number(cookTime) || 0,
      difficulty,
      healthLabels: parsedHealthLabels,
      nutritionalBreakdown: parsedNutritionalBreakdown,
      preparationNotes,
      createdBy: req.user.id,
      creatorModel,
      isExpertRecipe,
      approvedStatus,
      image: imageUrl
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
