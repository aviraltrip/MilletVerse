const express = require('express');
const router = express.Router();
const { interpretNote, generateRecipe, generatePrescriptionSummary } = require('../controllers/aiController');
const { isAiConfigured } = require('../services/openRouterService');
const verifyToken = require('../middleware/verifyToken');

router.get('/status', (req, res) => {
  res.json({
    configured: isAiConfigured(),
    provider: 'openrouter',
    model: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
  });
});

router.post('/interpret-note', verifyToken, interpretNote);
router.post('/generate-recipe', verifyToken, generateRecipe);
router.get('/prescription-summary', verifyToken, generatePrescriptionSummary);

module.exports = router;
