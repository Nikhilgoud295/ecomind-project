/**
 * EcoMind Calculations & Formatter Helpers
 */

export function calculateCO2Emissions(data) {
  const electricity = (parseFloat(data.electricity_kwh) || 0) * 0.82;
  const water = (parseFloat(data.water_liters) || 0) * 0.00034;
  const waste = (parseFloat(data.waste_kg) || 0) * 0.45;
  const fuel = (parseFloat(data.fuel_liters) || 0) * 2.68;
  const transport = (parseFloat(data.public_transport_km) || 0) * 0.17;

  const gross = electricity + water + waste + fuel + transport;
  const renewableOffset = gross * ((parseFloat(data.renewable_energy_pct) || 0) / 100) * 0.8;
  const recyclingOffset = (parseFloat(data.waste_kg) || 0) * 0.45 * ((parseFloat(data.recycling_pct) || 0) / 100) * 0.6;

  const net = Math.max(0, gross - renewableOffset - recyclingOffset);
  return {
    gross: Number(gross.toFixed(2)),
    net: Number(net.toFixed(2)),
  };
}

export function calculateSustainabilityScore(totalCO2Kg, avgRenewablePct = 0, avgRecyclingPct = 0) {
  const co2 = parseFloat(totalCO2Kg) || 0;
  const renew = parseFloat(avgRenewablePct) || 0;
  const recyc = parseFloat(avgRecyclingPct) || 0;

  // Base 95 score minus carbon penalty (0.4 pts per kg CO2 above 10 kg) + renewable & recycling bonuses
  const co2Penalty = co2 > 10 ? (co2 - 10) * 0.4 : 0;
  const renewableBonus = renew * 0.2; // up to +20 pts
  const recyclingBonus = recyc * 0.2; // up to +20 pts

  let score = Math.round(95 - co2Penalty + renewableBonus + recyclingBonus);
  return Math.max(15, Math.min(100, score));
}

export function getScoreBadge(score) {
  if (score >= 85) {
    return { label: 'Exceptional (A+)', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
  } else if (score >= 70) {
    return { label: 'Good Eco-Stand (B)', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' };
  } else if (score >= 45) {
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
