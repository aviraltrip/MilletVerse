const express = require('express');
const router = express.Router();
const { interpretNote, generateRecipe } = require('../controllers/aiController');
const verifyToken = require('../middleware/verifyToken');

router.post('/interpret-note', verifyToken, interpretNote);
router.post('/generate-recipe', verifyToken, generateRecipe);

module.exports = router;
