const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const DEFAULT_MODEL = 'google/gemini-2.5-flash';

if (!process.env.OPENROUTER_API_KEY) {
  console.error('CRITICAL: OPENROUTER_API_KEY is not set in .env file!');
} else {
  console.log(
    '✓ OPENROUTER_API_KEY loaded (prefix: ' +
      process.env.OPENROUTER_API_KEY.substring(0, 8) +
      '...)'
  );
}

/**
 * @param {string} prompt
 * @param {{ model?: string }} [options]
 * @returns {Promise<string>}
 */
async function generateText(prompt, options = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const model = options.model || process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  const siteUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': siteUrl,
      'X-OpenRouter-Title': 'MilletVerse',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens:
        options.maxTokens ??
        (Number(process.env.OPENROUTER_MAX_TOKENS) || 4096),
    }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`OpenRouter returned invalid JSON (HTTP ${response.status})`);
  }

  if (!response.ok) {
    const errMsg =
      data?.error?.message ||
      (typeof data?.error === 'string' ? data.error : null) ||
      data?.message ||
      `OpenRouter request failed (HTTP ${response.status})`;
    throw new Error(errMsg);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text || !String(text).trim()) {
    throw new Error('AI returned an empty response. Please try again.');
  }
  return String(text).trim();
}

function formatOpenRouterError(error) {
  const message = error?.message || '';

  if (/OPENROUTER_API_KEY|not configured/i.test(message)) {
    return 'AI service not configured. Set OPENROUTER_API_KEY in backend/.env and restart the server.';
  }

  if (/invalid.*api.*key|unauthorized|401|403|authentication/i.test(message)) {
    return 'OpenRouter API key is invalid. Update OPENROUTER_API_KEY in backend/.env and restart the server.';
  }

  if (/insufficient credits|quota|billing|402|429/i.test(message)) {
    return 'OpenRouter account has insufficient credits or rate limit reached. Check your OpenRouter dashboard.';
  }

  if (error instanceof SyntaxError) {
    return 'AI returned an unexpected format. Please try again.';
  }

  return message || 'Failed to process request using AI. Please try again.';
}

function isAiConfigured() {
  const key = process.env.OPENROUTER_API_KEY;
  return Boolean(key && String(key).trim());
}

module.exports = {
  generateText,
  formatOpenRouterError,
  isAiConfigured,
};
