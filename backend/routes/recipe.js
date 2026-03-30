const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getRecipes, getRecipeById, createRecipe, getMyRecipes } = require('../controllers/recipeController');
const verifyToken = require('../middleware/verifyToken');

// Use in-memory storage so we can upload directly to Cloudinary.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.get('/', getRecipes);
router.get('/me', verifyToken, getMyRecipes);
router.get('/:id', getRecipeById);
router.post('/', verifyToken, upload.single('image'), createRecipe);

module.exports = router;
