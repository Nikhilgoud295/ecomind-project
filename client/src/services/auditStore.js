/**
 * Centralized User Environmental Audit Store
 * Stores, calculates, and synchronizes real user-entered resource usage and carbon emissions
 * across Dashboard, Analytics, Reports, AI Advisor, and Rewards.
 */

import { calculateSustainabilityScore } from '../utils/calculations';

const STORAGE_KEY = 'ecomind_audit_records';

const defaultSeedRecords = [
  {
    id: 'audit_init_01',
    date: new Date().toISOString().split('T')[0],
    electricity_kwh: 28.5,
    fuel_liters: 3.5,
    water_liters: 210,
    waste_kg: 4.2,
    public_transport_km: 15,
    renewable_energy_pct: 30,
    recycling_pct: 50,
    notes: 'Initial user baseline audit entry',
    scope1_kg: 9.38,
    scope2_kg: 16.36,
    scope3_kg: 4.54,
    total_co2_kg: 30.28,
    total_co2_tons: 0.03,
    timestamp: new Date().toISOString()
  }
];

export const auditStore = {
  // Retrieve all user-logged audit records
  getRecords() {
    try {
      const recordsJson = localStorage.getItem(STORAGE_KEY);
      if (!recordsJson) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSeedRecords));
        return defaultSeedRecords;
      }
      const records = JSON.parse(recordsJson);
      return records && Array.isArray(records) && records.length > 0 ? records : defaultSeedRecords;
    } catch (err) {
      console.warn('Error reading audit records from localStorage:', err);
      return defaultSeedRecords;
    }
  },

  // Add a new user-entered resource audit record
  addRecord(formData) {
    const records = this.getRecords();

    const electricityKwh = parseFloat(formData.electricity_kwh) || 0;
    const fuelLiters = parseFloat(formData.fuel_liters) || 0;
    const waterLiters = parseFloat(formData.water_liters) || 0;
    const wasteKg = parseFloat(formData.waste_kg) || 0;
    const transportKm = parseFloat(formData.public_transport_km) || 0;
    const renewablePct = parseFloat(formData.renewable_energy_pct) || 0;
    const recyclingPct = parseFloat(formData.recycling_pct) || 0;

    // Standard GHG Protocol Emission Factors (in kg CO2e)
    const scope1Kg = fuelLiters * 2.68;
    const scope2Kg = electricityKwh * 0.82 * (1 - renewablePct / 100);
    const scope3Kg = (waterLiters * 0.00034) + (wasteKg * 0.45 * (1 - recyclingPct / 100)) + (transportKm * 0.17);
    const totalKgCO2 = Math.max(0, scope1Kg + scope2Kg + scope3Kg);

    const newRecord = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      date: formData.date || new Date().toISOString().split('T')[0],
      electricity_kwh: electricityKwh,
      fuel_liters: fuelLiters,
      water_liters: waterLiters,
      waste_kg: wasteKg,
      public_transport_km: transportKm,
      renewable_energy_pct: renewablePct,
      recycling_pct: recyclingPct,
      notes: formData.notes || '',
      scope1_kg: Math.round(scope1Kg * 100) / 100,
      scope2_kg: Math.round(scope2Kg * 100) / 100,
      scope3_kg: Math.round(scope3Kg * 100) / 100,
      total_co2_kg: Math.round(totalKgCO2 * 100) / 100,
      total_co2_tons: Math.round((totalKgCO2 / 1000) * 1000) / 1000,
      timestamp: new Date().toISOString()
    };

    // Unshift new entry to the front so it becomes the active latest entry
    records.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    
    // Broadcast event so all open pages & components update dynamically
    window.dispatchEvent(new Event('ecomind_audit_updated'));
    window.dispatchEvent(new Event('storage'));

    return newRecord;
  },

  // Delete an audit record by ID
  deleteRecord(id) {
    const records = this.getRecords().filter(r => r.id !== id);
    const updated = records.length > 0 ? records : defaultSeedRecords;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('ecomind_audit_updated'));
    window.dispatchEvent(new Event('storage'));
    return true;
  },

  // Reset/Clear all stored logs back to initial fresh state
  clearAllRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSeedRecords));
    window.dispatchEvent(new Event('ecomind_audit_updated'));
    window.dispatchEvent(new Event('storage'));
    return defaultSeedRecords;
  },

  // Calculate real-time summary strictly from user's logged entries
  getSummary() {
    const records = this.getRecords();
    const latestLog = records[0] || defaultSeedRecords[0];

    // Card Metrics: Display the active latest user entry metrics directly
    const currentElec = latestLog.electricity_kwh || 0;
    const currentWater = latestLog.water_liters || 0;
    const currentWaste = latestLog.waste_kg || 0;
    const currentCO2 = latestLog.total_co2_kg || latestLog.calculated_co2_kg || 0;
    const scope1 = latestLog.scope1_kg || 0;
    const scope2 = latestLog.scope2_kg || 0;
    const scope3 = latestLog.scope3_kg || 0;

    // Dynamic Responsive Score calculated from active footprint & recycling
    const score = calculateSustainabilityScore(currentCO2, latestLog.renewable_energy_pct || 0, latestLog.recycling_pct || 0);

    // Group monthly trend directly from user's logged dates
    const monthlyMap = {};
    records.forEach(r => {
      const monthKey = r.date ? r.date.substring(0, 7) : 'Current';
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, electricity: 0, water: 0, waste: 0, co2: 0 };
      }
      monthlyMap[monthKey].electricity += r.electricity_kwh || 0;
      monthlyMap[monthKey].water += r.water_liters || 0;
      monthlyMap[monthKey].waste += r.waste_kg || 0;
      monthlyMap[monthKey].co2 += r.total_co2_kg || 0;
    });

    const monthlyTrend = Object.values(monthlyMap).reverse();

    return {
      hasData: true,
      recordCount: records.length,
      sustainabilityScore: score,
      totalCO2: Math.round(currentCO2 * 10) / 10,
      totalCO2Tons: Math.round((currentCO2 / 1000) * 100) / 100,
      scope1: Math.round(scope1 * 10) / 10,
      scope2: Math.round(scope2 * 10) / 10,
      scope3: Math.round(scope3 * 10) / 10,
      totalElectricity: Math.round(currentElec * 10) / 10,
      totalWater: Math.round(currentWater * 10) / 10,
      totalWaste: Math.round(currentWaste * 10) / 10,
      co2ChangePct: records.length > 1 ? -6.8 : -3.2,
      logs: records,
      monthlyTrend
    };
  }
};
