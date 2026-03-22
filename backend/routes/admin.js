const express = require('express');
const router = express.Router(); // ✅ THIS LINE WAS MISSING

const { getStats, approveExpert, approveRecipe, getPendingExperts, getPendingRecipes } = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

// Apply middleware to all routes
router.use(verifyToken, isAdmin);

router.get('/stats', getStats);
router.get('/pending-experts', getPendingExperts);
router.get('/pending-recipes', getPendingRecipes);
router.put('/experts/:id/approve', approveExpert);
router.put('/recipes/:id/approve', approveRecipe);

module.exports = router;