const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GOOGLE_API_KEY;
let ai = null;

if (apiKey && !apiKey.includes('your-google')) {
  try {
    ai = new GoogleGenerativeAI(apiKey);
    console.log('✅ Google Gemini SDK Initialized Successfully');
  } catch (err) {
    console.warn('⚠️ Failed to initialize Gemini SDK:', err.message);
  }
} else {
  console.log('ℹ️ GOOGLE_API_KEY environment variable missing or default. EcoMind AI fallback engine active.');
}

module.exports = { ai };
