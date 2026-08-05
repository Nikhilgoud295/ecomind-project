const { analyzeWithGemini } = require('../services/geminiService');
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

module.exports = {
  analyzeSustainability,
  getLatestAIReport,
  fallbackAiReports,
};
