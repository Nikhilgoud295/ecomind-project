/**
 * EcoMind Calculations & Formatter Helpers
 */

export function calculateCO2Emissions(data) {
  const electricity = (parseFloat(data.electricity_kwh) || 0) * 0.85;
  const water = (parseFloat(data.water_liters) || 0) * 0.0003;
  const waste = (parseFloat(data.waste_kg) || 0) * 1.9;
  const fuel = (parseFloat(data.fuel_liters) || 0) * 2.31;
  const transport = (parseFloat(data.public_transport_km) || 0) * 0.05;

  const gross = electricity + water + waste + fuel + transport;
  const renewableOffset = gross * ((parseFloat(data.renewable_energy_pct) || 0) / 100) * 0.7;
  const recyclingOffset = (parseFloat(data.waste_kg) || 0) * 1.9 * ((parseFloat(data.recycling_pct) || 0) / 100) * 0.5;

  const net = Math.max(0, gross - renewableOffset - recyclingOffset);
  return {
    gross: Number(gross.toFixed(2)),
    net: Number(net.toFixed(2)),
  };
}

export function getScoreBadge(score) {
  if (score >= 85) {
    return { label: 'Exceptional (A+)', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
  } else if (score >= 70) {
    return { label: 'Good Eco-Stand (B)', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' };
  } else if (score >= 50) {
    return { label: 'Moderate (C)', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
  } else {
    return { label: 'High Footprint (D)', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' };
  }
}

export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
