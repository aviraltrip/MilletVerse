const STANDARD_CONDITIONS = [
  'diabetes',
  'hypertension',
  'anemia',
  'pcod',
  'celiac',
  'obesity',
  'thyroid',
  'joint pain',
];

/**
 * Extract and normalize a string[] of conditions from model output.
 * @param {string} rawText
 * @returns {string[]}
 */
function parseConditionsFromAi(rawText) {
  let cleaned = String(rawText || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    cleaned = arrayMatch[0];
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new SyntaxError('AI returned an unexpected format. Please try again.');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('AI returned an unexpected format. Please try again.');
  }

  const conditions = parsed
    .map((item) => {
      if (typeof item === 'string') return item.trim().toLowerCase();
      if (item && typeof item === 'object') {
        const val =
          item.condition ||
          item.name ||
          item.label ||
          item.value ||
          Object.values(item)[0];
        return String(val || '').trim().toLowerCase();
      }
      return '';
    })
    .filter(Boolean)
    .map(normalizeConditionSlug);

  return [...new Set(conditions)];
}

function normalizeConditionSlug(value) {
  const lower = value.toLowerCase().trim();
  for (const standard of STANDARD_CONDITIONS) {
    if (lower === standard || lower.includes(standard.replace(' ', '')) || lower.includes(standard)) {
      return standard;
    }
  }
  if (lower.includes('diabet')) return 'diabetes';
  if (lower.includes('hypertens') || lower.includes('high blood pressure')) return 'hypertension';
  if (lower.includes('anemi')) return 'anemia';
  if (lower.includes('pcod') || lower.includes('pcos')) return 'pcod';
  if (lower.includes('celiac')) return 'celiac';
  if (lower.includes('obes')) return 'obesity';
  if (lower.includes('thyroid')) return 'thyroid';
  if (lower.includes('joint')) return 'joint pain';
  return lower;
}

/**
 * @param {string} rawText
 * @returns {object}
 */
function parseJsonObjectFromAi(rawText) {
  let cleaned = String(rawText || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const objectMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    cleaned = objectMatch[0];
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new SyntaxError('AI returned an unexpected format. Please try again.');
  }
}

module.exports = {
  parseConditionsFromAi,
  parseJsonObjectFromAi,
};
