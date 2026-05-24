require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { generateText, isAiConfigured } = require('../services/openRouterService');

async function run() {
  if (!isAiConfigured()) {
    console.error('FAIL: OPENROUTER_API_KEY is not set');
    process.exit(1);
  }

  console.log('1/2 Testing OpenRouter connection...');
  const ping = await generateText('Reply with exactly: OK');
  if (!/ok/i.test(ping)) {
    throw new Error('Unexpected ping response: ' + ping.slice(0, 80));
  }
  console.log('   ✓ Connection OK');

  console.log('2/2 Testing clinical note JSON extraction...');
  const clinical = await generateText(
    `Return only this JSON array, no other text: ["diabetes", "hypertension"]`
  );
  const cleaned = clinical.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed) || parsed.length < 1) {
    throw new Error('Invalid JSON array from model');
  }
  console.log('   ✓ JSON parse OK:', JSON.stringify(parsed));

  console.log('\nAll OpenRouter checks passed.');
}

run().catch((err) => {
  console.error('\nFAIL:', err.message);
  process.exit(1);
});
