require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { generateText } = require('../services/openRouterService');
const { parseConditionsFromAi } = require('../services/aiResponseParser');

const note =
  'Patient is a 45-year-old male with type 2 diabetes mellitus (HbA1c 7.8%) and essential hypertension. Complains of mild joint pain.';

const prompt = `As a clinical nutritionist specializing in functional medicine, analyze the following doctor's note or patient description:
"${note}"

Extract the key health conditions from it. Map them to our standard conditions if applicable: diabetes, hypertension, anemia, pcod, celiac, obesity, thyroid, joint pain.
Return a JSON array of strings. ONLY RETURN THE JSON ARRAY, NO OTHER TEXT OR MARKDOWN EXPLANATIONS.
Example output: ["diabetes", "hypertension"]`;

(async () => {
  const rawText = await generateText(prompt);
  console.log('RAW (first 300 chars):', rawText.slice(0, 300));
  const conditions = parseConditionsFromAi(rawText);
  console.log('Parsed conditions:', conditions);
  if (!conditions.length) {
    throw new Error('No conditions parsed');
  }
  console.log('\ninterpret-note flow OK');
})().catch((err) => {
  console.error('FAIL:', err.message);
  process.exit(1);
});
