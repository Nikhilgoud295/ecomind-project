const { supabase } = require('../config/db');
const { fallbackUsageStore } = require('./usageController');

const fallbackReports = [];

const generateReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type = 'weekly', title, startDate, endDate } = req.body;

    let usages = [];

    if (supabase) {
      let query = supabase
        .from('resource_usage')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);

      const { data } = await query;
      usages = data || [];
    } else {
      usages = fallbackUsageStore.filter(u => u.user_id === userId || u.user_id === 'usr_demo');
    }

    // Compute aggregated totals
    const total_co2_kg = usages.reduce((acc, u) => acc + Number(u.calculated_co2_kg || 0), 0);
    const total_electricity_kwh = usages.reduce((acc, u) => acc + Number(u.electricity_kwh || 0), 0);
    const total_water_liters = usages.reduce((acc, u) => acc + Number(u.water_liters || 0), 0);
    const total_waste_kg = usages.reduce((acc, u) => acc + Number(u.waste_kg || 0), 0);
    const avg_renewable_pct = usages.length > 0 ? (usages.reduce((acc, u) => acc + Number(u.renewable_energy_pct || 0), 0) / usages.length).toFixed(1) : 0;
    const avg_recycling_pct = usages.length > 0 ? (usages.reduce((acc, u) => acc + Number(u.recycling_pct || 0), 0) / usages.length).toFixed(1) : 0;

    const summary_data = {
      record_count: usages.length,
      total_co2_kg: Number(total_co2_kg.toFixed(2)),
      total_electricity_kwh: Number(total_electricity_kwh.toFixed(2)),
      total_water_liters: Number(total_water_liters.toFixed(2)),
      total_waste_kg: Number(total_waste_kg.toFixed(2)),
      avg_renewable_pct: Number(avg_renewable_pct),
      avg_recycling_pct: Number(avg_recycling_pct),
      daily_avg_co2: usages.length > 0 ? Number((total_co2_kg / usages.length).toFixed(2)) : 0,
      entries: usages,
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const reportRecord = {
      user_id: userId,
      title: title || `EcoMind ${type.charAt(0).toUpperCase() + type.slice(1)} Sustainability Audit Report`,
      type,
      start_date: startDate || todayStr,
      end_date: endDate || todayStr,
      summary_data,
    };

    let savedReport = null;

    if (supabase) {
      const { data, error } = await supabase
        .from('reports')
        .insert([reportRecord])
        .select('*')
        .single();

      if (error) {
        console.warn('⚠️ Supabase error saving report:', error.message);
        savedReport = { id: `rep_${Date.now()}`, ...reportRecord, created_at: new Date().toISOString() };
      } else {
        savedReport = data;
      }
    } else {
      savedReport = { id: `rep_${Date.now()}`, ...reportRecord, created_at: new Date().toISOString() };
      fallbackReports.unshift(savedReport);
    }

    return res.status(201).json({
      success: true,
      message: `${type.toUpperCase()} report generated successfully`,
      report: savedReport,
    });
  } catch (err) {
    next(err);
  }
};

const getReports = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let list = [];

    if (supabase) {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) list = data;
    }

    if (list.length === 0) {
      list = fallbackReports.filter(r => r.user_id === userId);
      if (list.length === 0) {
        // Create an initial sample report if none exists
        const sampleReport = {
          id: 'rep_sample_01',
          user_id: userId,
          title: 'EcoMind Weekly Sustainability Overview',
          type: 'weekly',
          start_date: '2026-08-01',
          end_date: '2026-08-05',
          summary_data: {
            record_count: 5,
            total_co2_kg: 75.8,
            total_electricity_kwh: 81.7,
            total_water_liters: 615,
            total_waste_kg: 13.6,
            avg_renewable_pct: 34.0,
            avg_recycling_pct: 51.0,
            daily_avg_co2: 15.16,
            entries: fallbackUsageStore,
          },
          created_at: new Date().toISOString(),
        };
        list.push(sampleReport);
      }
    }

    return res.json({
      success: true,
      count: list.length,
      reports: list,
    });
  } catch (err) {
    next(err);
  }
};

const getReportById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    let report = null;

    if (supabase) {
      const { data } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      report = data;
    }

    if (!report) {
      report = fallbackReports.find(r => r.id === id || r.id === 'rep_sample_01');
    }

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    return res.json({
      success: true,
      report,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateReport,
  getReports,
  getReportById,
};
