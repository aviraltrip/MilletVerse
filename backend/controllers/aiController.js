const { GoogleGenerativeAI } = require('@google/genai');
const User = require('../models/User');
const Prescription = require('../models/Prescription');
const HealthMapping = require('../models/HealthMapping');
const Millet = require('../models/Millet');

const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Interpret doctor's note or symptoms and extract conditions
// @route   POST /api/ai/interpret-note
// @access  Private
exports.interpretNote = async (req, res) => {
  try {
    const { noteText } = req.body;
    
    if (!noteText) {
      return res.status(400).json({ message: 'Please provide note text' });
    }

    const prompt = `As a clinical nutritionist specializing in functional medicine, analyze the following doctor's note or patient description:
"${noteText}"

Extract the key health conditions from it. Map them to our standard conditions if applicable: diabetes, hypertension, anemia, pcod, celiac, obesity, thyroid, joint pain.
Return a JSON array of strings. ONLY RETURN THE JSON ARRAY, NO OTHER TEXT OR MARKDOWN EXPLANATIONS.
Example output: ["diabetes", "hypertension"]`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const response = await model.generateContent(prompt);
    
    let rawText = response.response.text();
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const conditions = JSON.parse(rawText);
    
    res.status(200).json({ conditions });
  } catch (error) {
    console.error('AI Processing Error:', error);
    res.status(500).json({ message: 'Failed to process note using AI. Please try again.' });
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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const response = await model.generateContent(prompt);
    
    let rawText = response.response.text();
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const recipeObj = JSON.parse(rawText);
    
    res.status(200).json(recipeObj);
  } catch (error) {
    console.error('AI Recipe Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate recipe. AI model might be unavailable.' });
  }
};

// @desc    Generate empathetic RAG summary for the user's active prescription
// @route   GET /api/ai/prescription-summary
// @access  Private
exports.generatePrescriptionSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch active prescription
    const prescription = await Prescription.findOne({ userId, isActive: true });
    if (!prescription) {
      return res.status(404).json({ 
        success: false, 
        message: 'No active prescription found. Please complete onboarding first.' 
      });
    }

    // 2. Fetch user profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const healthProfile = user.healthProfile || {};
    const conditions = healthProfile.conditions || [];

    // 3. Fetch health mapping guidelines for these conditions
    const healthMappings = await HealthMapping.find({ condition: { $in: conditions } });

    // 4. Fetch details of all millets
    const millets = await Millet.find({});

    // 5. Structure context into JSON payload for RAG
    const ragContext = {
      patientProfile: {
        age: healthProfile.age,
        weight: healthProfile.weight,
        height: healthProfile.height,
        bmi: healthProfile.bmi,
        bmiCategory: healthProfile.bmiCategory,
        conditions: conditions,
        labValues: healthProfile.labValues || {}
      },
      prescription: {
        generatedDate: prescription.generatedDate,
        version: prescription.version,
        items: prescription.items.map(item => ({
          milletName: item.millet,
          quantity: item.quantity,
          form: item.form,
          timing: item.timing,
          rationale: item.rationale
        }))
      },
      clinicalGuidelines: healthMappings.map(mapping => ({
        condition: mapping.condition,
        recommendedMillets: mapping.recommendedMillets,
        avoidMillets: mapping.avoidMillets,
        timingGuidelines: mapping.timing,
        rationale: mapping.rationale
      })),
      milletReferenceData: millets.map(m => ({
        name: m.name,
        localNames: m.localNames,
        nutrients: m.nutrients,
        benefits: m.benefits,
        cautions: m.cautions
      }))
    };

    // 6. Formulate strict system prompt for LLM call
    const prompt = `You are a clinical nutritionist and empathetic health guide. You are explaining a personalized millet diet plan to a patient.

Below is the patient's structured health profile and their prescribed millet plan in JSON format:
${JSON.stringify(ragContext, null, 2)}

Your task is to write an empathetic, plain-language patient summary. Explain in detail:
1. Why each prescribed millet is included and how it matches their health conditions, BMI, and lab values.
2. The specific health benefits they will receive from these millets.
3. List any precautions or cautions (e.g. oxalate cautions, thyroid limits) and what food items to avoid based strictly on the provided references.

STRICT INSTRUCTIONS:
- Depend ONLY on the provided JSON data. Do NOT invent external medical advice or mention clinical facts not in the data.
- Keep the tone warm, empathetic, and encouraging.
- Format the response in clean, beautiful Markdown with clear headings and lists. No HTML or code blocks.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const response = await model.generateContent(prompt);

    const summary = response.response.text() || '';
    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error('Vectorless RAG Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate AI summary explanation', 
      error: error.message 
    });
  }
};

