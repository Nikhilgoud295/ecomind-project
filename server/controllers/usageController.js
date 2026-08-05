const { supabase } = require('../config/db');
const { calculateEmissions } = require('../services/geminiService');

// In-memory fallback usage store for local dev / offline testing
let fallbackUsageStore = [
  {
    id: 'usg_101',
    user_id: 'usr_demo',
    date: '2026-08-01',
    electricity_kwh: 18.5,
    water_liters: 140,
    waste_kg: 3.2,
    fuel_liters: 2.0,
    public_transport_km: 12.0,
    renewable_energy_pct: 25,
    recycling_pct: 40,
    calculated_co2_kg: 17.8,
    notes: 'Base daily tracking',
    created_at: new Date('2026-08-01').toISOString(),
  },
  {
    id: 'usg_102',
    user_id: 'usr_demo',
    date: '2026-08-02',
    electricity_kwh: 22.0,
    water_liters: 165,
    waste_kg: 4.1,
    fuel_liters: 4.5,
    public_transport_km: 5.0,
    renewable_energy_pct: 20,
    recycling_pct: 35,
    calculated_co2_kg: 24.1,
    notes: 'Heavy vehicle commute day',
    created_at: new Date('2026-08-02').toISOString(),
  },
  {
    id: 'usg_103',
    user_id: 'usr_demo',
    date: '2026-08-03',
    electricity_kwh: 12.0,
    water_liters: 95,
    waste_kg: 1.8,
    fuel_liters: 0.0,
    public_transport_km: 25.0,
    renewable_energy_pct: 50,
    recycling_pct: 70,
    calculated_co2_kg: 9.3,
    notes: 'Eco-friendly transit day with solar power',
    created_at: new Date('2026-08-03').toISOString(),
  },
  {
    id: 'usg_104',
    user_id: 'usr_demo',
    date: '2026-08-04',
    electricity_kwh: 15.2,
    water_liters: 110,
    waste_kg: 2.5,
    fuel_liters: 1.2,
    public_transport_km: 18.0,
    renewable_energy_pct: 35,
    recycling_pct: 50,
    calculated_co2_kg: 13.6,
    notes: 'Moderate usage pattern',
    created_at: new Date('2026-08-04').toISOString(),
  },
  {
    id: 'usg_105',
    user_id: 'usr_demo',
    date: '2026-08-05',
    electricity_kwh: 14.0,
    water_liters: 105,
    waste_kg: 2.0,
    fuel_liters: 0.5,
    public_transport_km: 20.0,
    renewable_energy_pct: 40,
    recycling_pct: 60,
    calculated_co2_kg: 11.4,
    notes: 'Current session measurement',
    created_at: new Date('2026-08-05').toISOString(),
  }
];

const addUsage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const body = req.body;
    const date = body.date || new Date().toISOString().split('T')[0];

    const emissions = calculateEmissions(body);

    const record = {
      user_id: userId,
      date,
      electricity_kwh: body.electricity_kwh || 0,
      water_liters: body.water_liters || 0,
      waste_kg: body.waste_kg || 0,
      fuel_liters: body.fuel_liters || 0,
      public_transport_km: body.public_transport_km || 0,
      renewable_energy_pct: body.renewable_energy_pct || 0,
      recycling_pct: body.recycling_pct || 0,
      calculated_co2_kg: emissions.netEmissions,
      notes: body.notes || '',
    };

    let inserted = null;

    if (supabase) {
      const { data, error } = await supabase
        .from('resource_usage')
        .insert([record])
        .select('*')
        .single();

      if (error) throw error;
      inserted = data;
    } else {
      inserted = {
        id: `usg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ...record,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      fallbackUsageStore.unshift(inserted);
    }

    return res.status(201).json({
      success: true,
      message: 'Resource usage recorded successfully',
      usage: inserted,
      emissionsBreakdown: emissions,
    });
  } catch (err) {
    next(err);
  }
};

const getUsage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, limit = 30, page = 1 } = req.query;

    let items = [];

    if (supabase) {
      let query = supabase
        .from('resource_usage')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);

      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;
      if (error) throw error;
      items = data || [];
    } else {
      items = fallbackUsageStore.filter(u => u.user_id === userId || u.user_id === 'usr_demo');
      if (startDate) items = items.filter(u => u.date >= startDate);
      if (endDate) items = items.filter(u => u.date <= endDate);
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return res.json({
      success: true,
      count: items.length,
      page: Number(page),
      usage: items,
    });
  } catch (err) {
    next(err);
  }
};

const updateUsage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const body = req.body;

    const emissions = calculateEmissions(body);
    const updatedFields = {
      ...body,
      calculated_co2_kg: emissions.netEmissions,
      updated_at: new Date().toISOString(),
    };

    let updated = null;

    if (supabase) {
      const { data, error } = await supabase
        .from('resource_usage')
        .update(updatedFields)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) throw error;
      updated = data;
    } else {
      const index = fallbackUsageStore.findIndex(u => u.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Resource usage record not found' });
      }
      fallbackUsageStore[index] = { ...fallbackUsageStore[index], ...updatedFields };
      updated = fallbackUsageStore[index];
    }

    return res.json({
      success: true,
      message: 'Resource usage record updated',
      usage: updated,
    });
  } catch (err) {
    next(err);
  }
};

const deleteUsage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (supabase) {
      const { error } = await supabase
        .from('resource_usage')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      fallbackUsageStore = fallbackUsageStore.filter(u => !(u.id === id));
    }

    return res.json({
      success: true,
      message: 'Resource usage record deleted successfully',
      id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addUsage,
  getUsage,
  updateUsage,
  deleteUsage,
  fallbackUsageStore,
};
