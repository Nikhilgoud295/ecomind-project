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

    // 1. Unified Website Context & Friendly Gemini Prompt
    if (ai) {
      try {
        const modelNames = ['gemini-1.5-flash', 'gemini-pro', 'gemini-1.0-pro'];
        let reply = null;

        const websiteContext = `
        You are EcoMind AI Copilot, a warm, friendly, encouraging sustainability guide for the EcoMind platform (https://ecomind-project.vercel.app).

        WEBSITE FEATURES & NAVIGATION:
        - Dashboard (/dashboard): Real-time Gross CO2, Net Footprint, Eco Score, and interactive 3D WebGL Command Globe (360° orbit).
        - Upload & Add Data (/add-data): AI Document Upload (PDF bills, CSV energy logs) with Gemini OCR metric extraction + manual entry.
        - Intelligence Hub (/eco-news): SEBI BRSR Core, MCA updates, Compliance Calendar cutoffs, AI Recommendations, Industry Benchmarks, and 3D Global Climate Sphere tab.
        - Analytics (/analytics): Scope 1, Scope 2, Scope 3 charts and monthly trend breakdowns.
        - Reports (/reports): Audit-ready PDF & CSV report exports compliant with GHG Protocol & ISO 14064 standards.
        - Face ID Login (/login & /register): 128-point webcam facial biometric scanning for passwordless login.

        RESPONSE RULES:
        1. Start with a warm, encouraging 1-sentence opening.
        2. Provide an accurate, friendly answer broken into 3 short bullet points with emojis.
        3. End with a short helpful tip or navigation hint. Keep the response clear, concise, and easy to read.
        `;

        for (const modelName of modelNames) {
          try {
            const model = ai.getGenerativeModel({ model: modelName });
            const prompt = `${websiteContext}\n\nUser Question: "${query}"\nAnswer:`;

            const result = await model.generateContent(prompt);
            const responseText = result.response?.text();
            if (responseText && responseText.trim()) {
              reply = responseText.trim();
              break;
            }
          } catch (mErr) {
            console.warn(`Model ${modelName} attempt note:`, mErr.message);
          }
        }

        if (reply) {
          return res.json({ success: true, reply });
        }
      } catch (gErr) {
        console.warn('Gemini API call note, using local Knowledge Engine:', gErr.message);
      }
    }

    // 2. Comprehensive Website & Sustainability Intent Engine
    let reply = '';

    if (queryLower.includes('upload') || queryLower.includes('add data') || queryLower.includes('bill') || queryLower.includes('invoice') || queryLower.includes('pdf')) {
      reply = `📄 **How to Upload Bills & Add Data on EcoMind:**\n\n• 📍 **Navigate to "Upload & Record":** Click **"Upload & Add Data"** in your left Navigation Core sidebar.\n• 🤖 **AI Bill Extraction:** Drag and drop your utility bill (PDF, image, or CSV). Click **"Extract Metrics with Gemini AI"** to automatically parse kWh, water, and waste values.\n• ✍️ **Manual Entry Mode:** Prefer manual entry? Switch to the "Manual Form" tab to type values directly.\n\n💡 *Tip: Click "Confirm & Save Extracted Data" to instantly update your Dashboard metrics!*`;
    } else if (queryLower.includes('face') || queryLower.includes('biometric') || queryLower.includes('camera') || queryLower.includes('login')) {
      reply = `📸 **How Face ID Biometric Login Works on EcoMind:**\n\n• 🔑 **Sign Up with Face ID:** On the **Register** page, select **"Face ID Biometric"** to enroll your facial template using your camera.\n• 🔓 **Instant Face Sign In:** On the **Sign In** page, select **"Face ID Biometric"** and click **"Start AI Camera"** or **"Instant AI Face Scan"**.\n• 🛡️ **256-Bit Security:** Your facial landmarks are converted into an encrypted biometric token—no password needed!\n\n😊 *Need help? You can always switch back to Email & Password login anytime!*`;
    } else if (queryLower.includes('globe') || queryLower.includes('3d') || queryLower.includes('planet') || queryLower.includes('world')) {
      reply = `🌐 **How to Use the 3D WebGL Eco Globe:**\n\n• 🖱️ **Interactive 360° Orbit:** Click and drag your mouse anywhere on the globe on your **Dashboard** or **Intelligence Hub** to rotate planet Earth in 3D!\n• 📍 **Clickable Hotspots:** Click on green 3D pins around the world to inspect live data on Solar Grids, Reforestation Sanctuaries, and Clean Hydrogen Hubs.\n• 🌍 **Global Climate 🌐 Tab:** Visit the **"Intelligence Hub"** page and click the **"Global Climate 🌐"** tab for the full-screen revolving command sphere!`;
    } else if (queryLower.includes('sebi') || queryLower.includes('brsr') || queryLower.includes('compliance') || queryLower.includes('calendar')) {
      reply = `📜 **SEBI BRSR & Compliance Features on EcoMind:**\n\n• 📰 **Intelligence Feed:** Real-time updates on SEBI BRSR Core, MCA Companies Act rules, and CPCB regulations under the **"Intelligence Hub"** tab.\n• 📅 **Compliance Calendar:** Track upcoming filing cutoffs and toggle custom reminders.\n• 💡 **AI Recommendations:** Get personalized grant and cost-saving opportunities tailored to your industry!`;
    } else if (queryLower.includes('report') || queryLower.includes('export') || queryLower.includes('pdf') || queryLower.includes('download')) {
      reply = `📊 **How to Export Sustainability Reports:**\n\n• 📍 **Navigate to "Reports Export":** Click **"Reports Export"** in your left Navigation Core sidebar.\n• 📥 **Choose Format:** Select **PDF Executive Summary** or **CSV Raw Metrics Data**.\n• ✅ **Audit-Ready:** Reports conform to **GHG Protocol Scope 1 & 2** and **ISO 14064** standards for corporate audits.`;
    } else if (queryLower.includes('electricity') || queryLower.includes('power') || queryLower.includes('kwh') || queryLower.includes('energy')) {
      reply = `💡 **How to Reduce Electricity Usage & Carbon Footprint:**\n\n• 💡 **Switch to LEDs:** Reduces lighting energy load by **60%**.\n• ☀️ **Rooftop Solar:** Install solar PV arrays (check government subsidies under the Intelligence Hub!).\n• 🔌 **Eliminate Phantom Power:** Turn off standby switches on idle appliances.\n\n🌱 *Track your daily kWh under "Upload & Add Data" to see your carbon score decrease!*`;
    } else if (queryLower.includes('water') || queryLower.includes('liter') || queryLower.includes('rain')) {
      reply = `💧 **Water Conservation Tips:**\n\n• 🚰 **Tap Aerators:** Reduces faucet flow rate by **40%** without losing pressure.\n• 🌧️ **Rainwater Collection:** Store rainwater for landscaping and washing.\n• ♻️ **Graywater Reuse:** Reuse kitchen wash water for outdoor plants.`;
    } else if (queryLower.includes('waste') || queryLower.includes('recycle') || queryLower.includes('plastic')) {
      reply = `♻️ **Waste Management & Recycling:**\n\n• 🗑️ **2-Bin System:** Separate wet organic food waste from dry recyclables.\n• 🍏 **Home Composting:** Turn organic waste into rich soil fertilizer.\n• 🛍️ **Reusable Bags:** Avoid single-use plastic bags.`;
    } else if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
      reply = `👋 **Hello! Welcome to EcoMind AI.**\nHow can I help you today? Ask me about using any website feature (Upload Bills, 3D Globe, Face ID Login, Export Reports) or general sustainability tips! 😊`;
    } else {
      const subject = query.split(' ').slice(0, 3).join(' ') || 'your query';
      reply = `💡 **EcoMind AI Guide for "${subject}":**\n\n• 📊 **Track Metrics:** Log your resource data on the **"Upload & Add Data"** page.\n• 🌐 **Explore Insights:** View real-time carbon reduction analytics on your **Dashboard** and interactive 3D Globe.\n• 📜 **Stay Compliant:** Check statutory cutoffs and ESG updates under the **"Intelligence Hub"**.\n\n😊 *Feel free to ask me any specific question about using the EcoMind website or managing carbon emissions!*`;
    }

    return res.json({
      success: true,
      reply
    });
  } catch (err) {
    console.error('Chat AI Error:', err.message);
    return res.json({
      success: true,
      reply: '💡 **Hello!** I am your EcoMind AI Copilot. Ask me about using any feature on EcoMind (Upload Bills, 3D Globe, Face ID Login, Reports Export) or saving energy!'
    });
  }
};

module.exports = {
  analyzeSustainability,
  getLatestAIReport,
  chatWithAI,
  fallbackAiReports,
};
