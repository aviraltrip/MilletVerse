const User = require('../models/User');
const Prescription = require('../models/Prescription');
const {
  generateText,
  formatOpenRouterError,
  isAiConfigured,
} = require('../services/openRouterService');
const {
  parseConditionsFromAi,
  parseJsonObjectFromAi,
} = require('../services/aiResponseParser');

function aiNotConfiguredResponse(res, useSuccessFlag = false) {
  console.error('FATAL: OPENROUTER_API_KEY not configured');
  const message = 'AI service not properly configured. API key missing.';
  if (useSuccessFlag) {
    return res.status(500).json({ success: false, message });
  }
  return res.status(500).json({ message });
}

// @desc    Interpret doctor's note or symptoms and extract conditions
// @route   POST /api/ai/interpret-note
// @access  Private
exports.interpretNote = async (req, res) => {
  try {
    const { noteText } = req.body;

    if (!noteText) {
      return res.status(400).json({ message: 'Please provide note text' });
    }

    if (!isAiConfigured()) {
      return aiNotConfiguredResponse(res);
    }

    const prompt = `As a clinical nutritionist specializing in functional medicine, analyze the following doctor's note or patient description:
"${noteText}"

Extract the key health conditions from it. Map them to our standard conditions if applicable: diabetes, hypertension, anemia, pcod, celiac, obesity, thyroid, joint pain.
Return a JSON array of strings. ONLY RETURN THE JSON ARRAY, NO OTHER TEXT OR MARKDOWN EXPLANATIONS.
Example output: ["diabetes", "hypertension"]`;

    console.log('Calling OpenRouter for note interpretation...');
    const rawText = await generateText(prompt, { maxTokens: 512 });
    const conditions = parseConditionsFromAi(rawText);

    res.status(200).json({ conditions });
  } catch (error) {
    console.error('❌ AI Processing Error - Full Details:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: formatOpenRouterError(error) });
  }
};

// @desc    Generate a custom millet recipe via AI
// @route   POST /api/ai/generate-recipe
// @access  Private
exports.generateRecipe = async (req, res) => {
  try {
    const { ingredientsList, condition } = req.body;

    if (!ingredientsList) {
      return res.status(400).json({ message: 'Please provide some ingredients to base the recipe on.' });
    }

    if (!isAiConfigured()) {
      return aiNotConfiguredResponse(res);
    }

    const prompt = `Act as an expert clinical culinary nutritionist specializing in functional millets. 
Design a unique, delicious, and deeply healthy millet recipe utilizing these main ingredients: "${ingredientsList}".
${condition ? 'The recipe MUST be highly beneficial for a patient suffering from: ' + condition + '.' : ''}

You MUST return the output EXACTLY in the following JSON format. Do not use markdown backticks, do not include any other text except the JSON object.
{
  "title": "String",
  "milletType": "String (e.g. Finger Millet)",
  "ingredients": [{ "name": "String", "quantity": "String" }],
  "steps": ["String"],
  "tags": ["String"],
  "cookTime": Number (e.g. 25),
  "difficulty": "String (easy, medium, or hard)",
  "healthLabels": ["String"],
  "nutritionalBreakdown": { "calories": Number, "protein": Number, "carbs": Number, "fiber": Number },
  "preparationNotes": "String"
}`;

    console.log('Calling OpenRouter for recipe generation...');
    const rawText = await generateText(prompt);
    const recipeObj = parseJsonObjectFromAi(rawText);

    res.status(200).json(recipeObj);
  } catch (error) {
    console.error('❌ AI Recipe Generation Error - Full Details:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Failed to generate recipe. ' + formatOpenRouterError(error) });
  }
};

// @desc    Generate empathetic AI summary for the user's active prescription
// @route   GET /api/ai/prescription-summary
// @access  Private
exports.generatePrescriptionSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!isAiConfigured()) {
      return aiNotConfiguredResponse(res, true);
    }

    const prescription = await Prescription.findOne({ userId, isActive: true });
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'No active prescription found. Please complete onboarding first.',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const healthProfile = user.healthProfile || {};
    const conditions = (healthProfile.conditions || []).join(', ') || 'general wellness';
    const planLines = prescription.items
      .map(
        (item, i) =>
          `${i + 1}. ${item.millet} — ${item.quantity}, ${item.form}, ${item.timing}. Reason: ${item.rationale || 'as prescribed'}`
      )
      .join('\n');

    const prompt = `You are a warm, empathetic clinical nutritionist explaining a personalized millet diet plan.

Patient profile:
- Conditions: ${conditions}
- Age: ${healthProfile.age ?? 'not specified'}
- BMI: ${healthProfile.bmi ?? 'not specified'} (${healthProfile.bmiCategory || 'n/a'})

Prescribed plan:
${planLines}

Write a clear, encouraging patient summary in Markdown (headings and bullet lists, no code blocks):
1. Why these millets fit their health profile.
2. Key benefits they can expect.
3. Simple daily tips for following the plan.

Keep it concise (under 400 words). Use only the information above.`;

    console.log('Calling OpenRouter for prescription summary...');
    const summary = await generateText(prompt, { maxTokens: 2048 });
    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error('❌ Prescription summary error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI summary: ' + formatOpenRouterError(error),
    });
  }
};
