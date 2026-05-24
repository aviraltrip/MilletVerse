const express = require('express');
const router = express.Router();
const { interpretNote, generateRecipe, generatePrescriptionSummary } = require('../controllers/aiController');
const verifyToken = require('../middleware/verifyToken');

router.post('/interpret-note', verifyToken, interpretNote);
router.post('/generate-recipe', verifyToken, generateRecipe);
router.get('/prescription-summary', verifyToken, generatePrescriptionSummary);

module.exports = router;
