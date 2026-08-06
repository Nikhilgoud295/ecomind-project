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
      // Create a default initial baseline report
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
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    if (!ai) {
      const msgLower = message.toLowerCase();
      let reply = "I am EcoMind Gemini AI Copilot. I can help answer queries about carbon footprints, electricity reduction, SEBI BRSR compliance, renewable subsidies, and waste management.";

      if (msgLower.includes('sebi') || msgLower.includes('brsr')) {
        reply = "SEBI BRSR (Business Responsibility & Sustainability Reporting) Core mandates that top 1,000 listed Indian entities disclose verified Scope 1, Scope 2, water discharge, and circular economy metrics with independent third-party reasonable assurance starting FY 2024-25.";
      } else if (msgLower.includes('electricity') || msgLower.includes('power') || msgLower.includes('kwh')) {
        reply = "To reduce electricity carbon footprint: 1) Switch lighting to high-efficiency LEDs (saves 40-75% energy). 2) Upgrade HVAC to inverter models. 3) Install rooftop solar (MNRE offers subsidies up to 40%). 4) Eliminate phantom loads using smart power strips.";
      } else if (msgLower.includes('scope 1') || msgLower.includes('scope 2') || msgLower.includes('emissions')) {
        reply = "Scope 1 emissions refer to direct greenhouse gas emissions from sources owned or controlled by your organization (e.g. fuel consumed in company vehicles or boilers). Scope 2 emissions refer to indirect emissions from purchased electricity, steam, heating, or cooling.";
      } else if (msgLower.includes('subsidy') || msgLower.includes('grant') || msgLower.includes('scheme')) {
        reply = "Key government sustainability subsidies include: 1) MNRE National Green Hydrogen Mission (15% capital subsidy). 2) MSME Rooftop Solar & ZED Certification (40% subsidy on solar PV up to 500kW). 3) BEE Carbon Credit Trading Scheme (CCCs monetization).";
      }

      return res.json({ success: true, reply });
    }

    const systemPrompt = `
    You are EcoMind AI Copilot, an elite environmental scientist, sustainability expert, and corporate ESG consultant.
    Answer the user's question clearly, concisely, and professionally using bullet points when helpful.
    User Question: ${message}
    `;

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(systemPrompt);
    const reply = result.response.text();

    return res.json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error('Chat AI Error:', err.message);
    return res.json({
      success: true,
      reply: 'EcoMind AI Copilot: Direct carbon footprint tracking and SEBI BRSR compliance guidelines are accessible via your EcoMind Intelligence Hub and Dashboard.'
    });
  }
};

module.exports = {
  analyzeSustainability,
  getLatestAIReport,
  chatWithAI,
  fallbackAiReports,
};
