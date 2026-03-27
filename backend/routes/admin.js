const express = require('express');
const router = express.Router(); // ✅ THIS LINE WAS MISSING

const { getStats, approveExpert, approveRecipe, getPendingExperts, getPendingRecipes } = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

// Apply middleware to all routes
router.use(verifyToken, isAdmin);

router.get('/stats', getStats);
router.get('/users', require('../controllers/adminController').getAllUsers);
router.get('/experts', require('../controllers/adminController').getAllExperts);
router.post('/experts', require('../controllers/adminController').createExpert);
router.put('/experts/:id', require('../controllers/adminController').updateExpert);
router.delete('/experts/:id', require('../controllers/adminController').deleteExpert);
router.get('/pending-experts', getPendingExperts);
router.get('/pending-recipes', getPendingRecipes);
router.put('/experts/:id/approve', approveExpert);
router.put('/recipes/:id/approve', approveRecipe);

module.exports = router;