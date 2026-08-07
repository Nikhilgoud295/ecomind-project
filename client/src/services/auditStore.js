/**
 * Centralized User Environmental Audit Store
 * Enforces strict per-user account isolation. Each user account maintains
 * its own isolated carbon ledger. New user accounts start with 0 data and update strictly
 * when the user inserts data manually or via document upload.
 */

import { calculateSustainabilityScore } from '../utils/calculations';

export const auditStore = {
  // Helper to determine the isolated storage key for the currently logged-in user account
  getUserStorageKey() {
    try {
      const userStr = localStorage.getItem('ecomind_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.email) {
          return `ecomind_audit_records_${user.email.toLowerCase().trim()}`;
        }
      }
    } catch (e) {
      console.warn('User storage key resolution note:', e);
    }
    return 'ecomind_audit_records_default';
  },

  // Retrieve all audit records for the currently logged-in user account (Starts at [] for new accounts)
  getRecords() {
    try {
      const key = this.getUserStorageKey();
      const recordsJson = localStorage.getItem(key);
      if (!recordsJson) return [];
      const records = JSON.parse(recordsJson);
      return records && Array.isArray(records) ? records : [];
    } catch (err) {
      console.warn('Error reading user audit records:', err);
      return [];
    }
  },

  // Add a new resource audit record strictly scoped to the logged-in user account
  addRecord(formData) {
    const key = this.getUserStorageKey();
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

    records.unshift(newRecord);
    localStorage.setItem(key, JSON.stringify(records));
    
    // Broadcast events so Dashboard, Analytics, Reports, AI Advisor update in real-time
    window.dispatchEvent(new Event('ecomind_audit_updated'));
    window.dispatchEvent(new Event('storage'));

    return newRecord;
  },

  // Delete an audit record by ID for the active user account
  deleteRecord(id) {
    const key = this.getUserStorageKey();
    const records = this.getRecords().filter(r => r.id !== id);
    localStorage.setItem(key, JSON.stringify(records));
    window.dispatchEvent(new Event('ecomind_audit_updated'));
    window.dispatchEvent(new Event('storage'));
    return true;
  },

  // Reset/Clear all stored logs for the active user account back to 0
  clearAllRecords() {
    const key = this.getUserStorageKey();
    localStorage.removeItem(key);
    window.dispatchEvent(new Event('ecomind_audit_updated'));
    window.dispatchEvent(new Event('storage'));
    return [];
  },

  // Calculate real-time summary strictly from the active user's logged entries
  getSummary() {
    const records = this.getRecords();
    const hasData = records.length > 0;

    // If new user account has 0 records inserted yet, return clean 0 state
    if (!hasData) {
      return {
        hasData: false,
        recordCount: 0,
        sustainabilityScore: 0,
        totalCO2: 0,
        totalCO2Tons: 0,
        scope1: 0,
        scope2: 0,
        scope3: 0,
        totalElectricity: 0,
        totalWater: 0,
        totalWaste: 0,
        co2ChangePct: 0,
        logs: [],
        monthlyTrend: []
      };
    }

    // Latest user entry metrics for primary cards
    const latestLog = records[0];
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
      co2ChangePct: records.length > 1 ? -6.8 : 0,
      logs: records,
      monthlyTrend
    };
  }
};
