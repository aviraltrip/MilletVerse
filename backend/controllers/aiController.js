const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let rawText = response.text;
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let rawText = response.text;
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const recipeObj = JSON.parse(rawText);
    
    res.status(200).json(recipeObj);
  } catch (error) {
    console.error('AI Recipe Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate recipe. AI model might be unavailable.' });
  }
};
