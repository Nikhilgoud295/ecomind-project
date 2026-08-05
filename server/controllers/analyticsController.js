const { supabase } = require('../config/db');
const { fallbackUsageStore } = require('./usageController');

const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let records = [];

    if (supabase) {
      const { data, error } = await supabase
        .from('resource_usage')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (!error && data) records = data;
    }

    if (records.length === 0) {
      records = fallbackUsageStore.filter(u => u.user_id === userId || u.user_id === 'usr_demo');
      records.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Compute aggregated analytics metrics
    const totalCO2 = records.reduce((acc, r) => acc + Number(r.calculated_co2_kg || 0), 0);
    const totalElec = records.reduce((acc, r) => acc + Number(r.electricity_kwh || 0), 0);
    const totalWater = records.reduce((acc, r) => acc + Number(r.water_liters || 0), 0);
    const totalWaste = records.reduce((acc, r) => acc + Number(r.waste_kg || 0), 0);
    const avgRenewable = records.length ? records.reduce((acc, r) => acc + Number(r.renewable_energy_pct || 0), 0) / records.length : 0;
    const avgRecycling = records.length ? records.reduce((acc, r) => acc + Number(r.recycling_pct || 0), 0) / records.length : 0;

    // Calculate Sustainability Score (100 base, deducted for high emissions, credited for renewables & recycling)
    let sustainabilityScore = 82;
    if (records.length > 0) {
      const avgDailyCO2 = totalCO2 / records.length;
      let score = 90 - (avgDailyCO2 * 1.5) + (avgRenewable * 0.25) + (avgRecycling * 0.15);
      sustainabilityScore = Math.max(20, Math.min(99, Math.round(score)));
    }

    const chartData = records.map(r => ({
      date: r.date,
      co2: Number(r.calculated_co2_kg || 0),
      electricity: Number(r.electricity_kwh || 0),
      water: Number(r.water_liters || 0),
      waste: Number(r.waste_kg || 0),
      renewable: Number(r.renewable_energy_pct || 0),
      recycling: Number(r.recycling_pct || 0),
    }));

    // Weekly vs Previous Week aggregate comparison
    const recentWeek = chartData.slice(-7);
    const prevWeek = chartData.slice(-14, -7);

    const recentWeekCO2 = recentWeek.reduce((acc, c) => acc + c.co2, 0);
    const prevWeekCO2 = prevWeek.reduce((acc, c) => acc + c.co2, 0) || recentWeekCO2 * 1.12;
    const co2ChangePct = prevWeekCO2 ? Number((((recentWeekCO2 - prevWeekCO2) / prevWeekCO2) * 100).toFixed(1)) : -8.5;

    return res.json({
      success: true,
      summary: {
        sustainabilityScore,
        totalCO2: Number(totalCO2.toFixed(2)),
        totalElectricity: Number(totalElec.toFixed(2)),
        totalWater: Number(totalWater.toFixed(2)),
        totalWaste: Number(totalWaste.toFixed(2)),
        avgRenewablePct: Number(avgRenewable.toFixed(1)),
        avgRecyclingPct: Number(avgRecycling.toFixed(1)),
        co2ChangePct,
        recordsCount: records.length,
      },
      chartData,
      breakdown: {
        electricityEmissions: Number((totalElec * 0.85).toFixed(2)),
        waterEmissions: Number((totalWater * 0.0003).toFixed(2)),
        wasteEmissions: Number((totalWaste * 1.9).toFixed(2)),
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAnalytics,
};
