const { analyzeWithGemini } = require('../services/geminiService');
const { ai } = require('../config/gemini');
const { supabase } = require('../config/db');

// In-memory store for fallback AI reports
const fallbackAiReports = [];

const analyzeSustainability = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const metrics = req.body;

    const aiResult = await analyzeWithGemini(metrics);

    const reportRecord = {
      user_id: userId,
      usage_id: metrics.usageId || null,
      sustainability_score: aiResult.sustainability_score,
      summary: aiResult.summary,
      strengths: aiResult.strengths,
      problems: aiResult.problems,
      recommendations: aiResult.recommendations,
      carbon_reduction_tips: aiResult.carbon_reduction_tips,
      water_saving_tips: aiResult.water_saving_tips,
      energy_saving_tips: aiResult.energy_saving_tips,
      waste_reduction_plan: aiResult.waste_reduction_plan,
      priority_actions: aiResult.priority_actions,
    };

    let savedReport = null;

    if (supabase) {
      const { data, error } = await supabase
        .from('ai_reports')
        .insert([reportRecord])
        .select('*')
        .single();

      if (error) {
        console.warn('⚠️ Supabase save error for AI report:', error.message);
        savedReport = { id: `air_${Date.now()}`, ...reportRecord, created_at: new Date().toISOString() };
      } else {
        savedReport = data;
      }
    } else {
      savedReport = { id: `air_${Date.now()}`, ...reportRecord, created_at: new Date().toISOString() };
      fallbackAiReports.unshift(savedReport);
    }

    return res.status(201).json({
      success: true,
      message: 'AI sustainability analysis complete',
      analysis: savedReport,
    });
  } catch (err) {
    next(err);
  }
};

const getLatestAIReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let latest = null;

    if (supabase) {
      const { data } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      latest = data;
    }

    if (!latest) {
      latest = fallbackAiReports.find(r => r.user_id === userId) || fallbackAiReports[0] || null;
    }

    if (!latest) {
      const defaultMetrics = { electricity_kwh: 15, water_liters: 120, waste_kg: 2.5, renewable_energy_pct: 20, recycling_pct: 45 };
      const fallbackAnalysis = await analyzeWithGemini(defaultMetrics);
      latest = {
        id: 'air_default',
        user_id: userId,
        ...fallbackAnalysis,
        created_at: new Date().toISOString(),
      };
    }

    return res.json({
      success: true,
      report: latest,
    });
  } catch (err) {
    next(err);
  }
};

const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const query = message.trim();
    const queryLower = query.toLowerCase();

    // 1. Try Gemini API with User-Friendly Warm Persona
    if (ai) {
      try {
        const modelNames = ['gemini-1.5-flash', 'gemini-pro', 'gemini-1.0-pro'];
        let reply = null;

        for (const modelName of modelNames) {
          try {
            const model = ai.getGenerativeModel({ model: modelName });
            const prompt = `You are EcoMind AI Copilot, a warm, friendly, and encouraging sustainability guide.
            Answer the user's question in a super clear, friendly, and easy-to-understand conversational tone.
            Question: "${query}"
            Rules:
            1. Start with a warm, encouraging 1-sentence opening.
            2. Break down the advice into 3 simple, friendly bullet points with emojis.
            3. End with a short helpful tip or encouragement. Keep the response concise and readable.`;

            const result = await model.generateContent(prompt);
            const responseText = result.response?.text();
            if (responseText && responseText.trim()) {
              reply = responseText.trim();
              break;
            }
          } catch (mErr) {
            console.warn(`Model ${modelName} attempt error:`, mErr.message);
          }
        }

        if (reply) {
          return res.json({ success: true, reply });
        }
      } catch (gErr) {
        console.warn('Gemini API call failed, falling back to Friendly AI Engine:', gErr.message);
      }
    }

    // 2. Friendly, Easy-To-Understand Knowledge Engine
    let reply = '';

    if (queryLower.includes('electricity') || queryLower.includes('power') || queryLower.includes('kwh') || queryLower.includes('energy')) {
      reply = `💡 **Great question! Here are 3 simple ways to cut your electricity bill & carbon footprint:**\n\n• 💡 **Switch to LED Bulbs:** Replacing traditional bulbs with LEDs saves up to **60% energy** instantly.\n• ☀️ **Go Solar:** Installing rooftop solar panels can reduce your power bill and earn green incentives.\n• 🔌 **Stop Phantom Loads:** Turn off wall switches for appliances when not in use—standby power adds up!\n\n🌱 *Tip: You can log your daily electricity kWh under the "Upload & Add Data" tab to track your progress!*`;
    } else if (queryLower.includes('water') || queryLower.includes('liter') || queryLower.includes('rain')) {
      reply = `💧 **Here is how you can easily save water every day:**\n\n• 🚰 **Install Tap Aerators:** Aerators screw onto your faucets to reduce water flow by 40% without losing pressure.\n• 🌧️ **Rainwater Harvesting:** Collect rainwater from roofs to water plants and wash cars.\n• ♻️ **Reuse Graywater:** Water from washing vegetables can easily be used for garden plants.\n\n🌊 *Tip: Small daily habit changes save thousands of liters a year!*`;
    } else if (queryLower.includes('waste') || queryLower.includes('plastic') || queryLower.includes('recycle') || queryLower.includes('garbage')) {
      reply = `♻️ **Here is an easy guide to managing waste and going green:**\n\n• 🗑️ **Separate Waste at Home:** Use two bins—one for wet organic food waste and one for dry recyclables (paper, plastic).\n• 🍏 **Start Kitchen Composting:** Turn fruit peels and veg scraps into nutrient-rich soil for garden plants.\n• 🛍️ **Ditch Single-Use Plastics:** Carry cloth shopping bags and reusable water bottles.\n\n🌿 *Tip: Recycling just 1 kg of paper saves 17 trees and 26 liters of water!*`;
    } else if (queryLower.includes('sebi') || queryLower.includes('brsr') || queryLower.includes('compliance')) {
      reply = `📜 **SEBI BRSR Compliance Made Simple:**\n\n• 📊 **What is BRSR?** It is SEBI's reporting framework for top companies in India to share their environmental performance.\n• 🔍 **Core Requirements:** Report your energy usage, water consumption, waste recycled, and Scope 1 & 2 carbon emissions.\n• ✅ **How EcoMind Helps:** You can track all these metrics directly on your EcoMind Dashboard and export audit-ready reports!\n\n💡 *Tip: Visit our "Intelligence Hub" tab for the latest statutory deadline updates!*`;
    } else if (queryLower.includes('scope 1') || queryLower.includes('scope 2') || queryLower.includes('scope 3') || queryLower.includes('emissions')) {
      reply = `📊 **Understanding Carbon Emissions (Easy Explanation):**\n\n• 🔥 **Scope 1 (Direct):** Emissions from fuels burned directly on your property (like petrol/diesel in company vehicles).\n• ⚡ **Scope 2 (Electricity):** Indirect emissions created by power plants generating the electricity you buy.\n• 🚚 **Scope 3 (Supply Chain):** Emissions from suppliers, employee travel, and product shipping.\n\n🌱 *Tip: EcoMind automatically calculates your Scope 1 and Scope 2 totals when you add data!*`;
    } else if (queryLower.includes('subsidy') || queryLower.includes('grant') || queryLower.includes('scheme') || queryLower.includes('government')) {
      reply = `🏛️ **Government Subsidies & Financial Incentives:**\n\n• ☀️ **PM Surya Ghar Solar Scheme:** Get up to **40% subsidy** for installing residential rooftop solar panels.\n• ⚡ **Green Hydrogen Subsidies:** Capital grants for industrial clean energy transitions.\n• 📜 **MSME ZED Certification:** Up to 80% discount on green quality certification for small businesses.\n\n💡 *Check out the "AI Strategic Opportunities" tab in the Intelligence Hub for step-by-step application links!*`;
    } else if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
      reply = `👋 **Hello there! I am your EcoMind AI Copilot.**\nHow can I help you today? You can ask me about saving electricity, cutting water waste, SEBI BRSR rules, or government solar subsidies! 😊`;
    } else {
      const topic = query.split(' ').slice(0, 3).join(' ') || 'your question';
      reply = `💡 **Here is helpful advice regarding "${topic}":**\n\n• 🎯 **Measure First:** Start by recording your daily energy and water usage under the **"Upload & Add Data"** tab.\n• 🌿 **Take Action:** Simple changes like LED lights, tap aerators, and waste segregation reduce your carbon footprint by 25%.\n• 📈 **Track Improvement:** Watch your Eco Score rise on your EcoMind Dashboard as you log lower emissions!\n\n😊 *Feel free to ask me any specific question about energy, water, waste, or ESG compliance!*`;
    }

    return res.json({
      success: true,
      reply
    });
  } catch (err) {
    console.error('Chat AI Error:', err.message);
    return res.json({
      success: true,
      reply: '💡 **Hello!** I am here to help you reduce your carbon footprint and save energy. Ask me any question about electricity savings, water conservation, waste recycling, or ESG compliance!'
    });
  }
};

module.exports = {
  analyzeSustainability,
  getLatestAIReport,
  chatWithAI,
  fallbackAiReports,
};
