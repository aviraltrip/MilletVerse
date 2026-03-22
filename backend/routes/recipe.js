const express = require('express');
const router = express.Router();
const { getRecipes, getRecipeById, createRecipe, getMyRecipes } = require('../controllers/recipeController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', getRecipes);
router.get('/me', verifyToken, getMyRecipes);
router.get('/:id', getRecipeById);
router.post('/', verifyToken, createRecipe);

module.exports = router;
