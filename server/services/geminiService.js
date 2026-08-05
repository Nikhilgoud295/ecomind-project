const { ai } = require('../config/gemini');

/**
 * Calculates carbon footprint based on standard IPCC emission factors
 */
function calculateEmissions(metrics) {
  const electricityEmissions = (metrics.electricity_kwh || 0) * 0.85; // 0.85 kg CO2 per kWh grid avg
  const waterEmissions = (metrics.water_liters || 0) * 0.0003; // 0.3g CO2 per liter treated water
  const wasteEmissions = (metrics.waste_kg || 0) * 1.9; // 1.9 kg CO2 per kg municipal waste
  const fuelEmissions = (metrics.fuel_liters || 0) * 2.31; // 2.31 kg CO2 per L petrol
  const transportEmissions = (metrics.public_transport_km || 0) * 0.05; // 0.05 kg CO2 per km public transport

  const grossEmissions = electricityEmissions + waterEmissions + wasteEmissions + fuelEmissions + transportEmissions;
  const renewableOffset = grossEmissions * ((metrics.renewable_energy_pct || 0) / 100) * 0.7;
  const recyclingOffset = (metrics.waste_kg || 0) * 1.9 * ((metrics.recycling_pct || 0) / 100) * 0.5;

  const netEmissions = Math.max(0, grossEmissions - renewableOffset - recyclingOffset);
  return {
    grossEmissions: Number(grossEmissions.toFixed(2)),
    netEmissions: Number(netEmissions.toFixed(2)),
    breakdown: {
      electricity: Number(electricityEmissions.toFixed(2)),
      water: Number(waterEmissions.toFixed(2)),
      waste: Number(wasteEmissions.toFixed(2)),
      fuel: Number(fuelEmissions.toFixed(2)),
      transport: Number(transportEmissions.toFixed(2)),
    }
  };
}

/**
 * Fallback scoring & analysis generator when AI is offline or API key is unconfigured
 */
function generateFallbackAnalysis(metrics, emissions) {
  let score = 75;
  if (metrics.electricity_kwh > 25) score -= 10;
  if (metrics.water_liters > 200) score -= 10;
  if (metrics.waste_kg > 5) score -= 10;
  if (metrics.fuel_liters > 5) score -= 10;
  if (metrics.renewable_energy_pct > 30) score += 10;
  if (metrics.recycling_pct > 40) score += 10;
  score = Math.max(10, Math.min(100, score));

  return {
    sustainability_score: score,
    summary: `Your calculated environmental footprint for this entry is ${emissions.netEmissions} kg CO2e. Electricity and transportation represent your primary impact areas.`,
    strengths: [
      metrics.renewable_energy_pct > 0 ? `Utilizing ${metrics.renewable_energy_pct}% clean renewable energy` : 'Actively tracking daily resource metrics',
      metrics.recycling_pct > 0 ? `Diverting ${metrics.recycling_pct}% of waste through recycling` : 'Public transport usage keeps emissions lower than driving',
      'Regular monitoring establishes a strong sustainability baseline'
    ],
    problems: [
      metrics.electricity_kwh > 15 ? `Electricity consumption (${metrics.electricity_kwh} kWh) exceeds eco-benchmark` : 'Opportunity to further increase renewable energy share',
      metrics.fuel_liters > 0 ? `Direct fuel usage generated ${emissions.breakdown.fuel} kg CO2` : 'Potential to optimize water usage during peak hours'
    ],
    recommendations: [
      'Transition key appliances to ENERGY STAR certified models',
      'Install low-flow water aerators to curb water usage by up to 30%',
      'Implement a multi-bin composting and recycling system'
    ],
    carbon_reduction_tips: [
      'Optimize HVAC temperature settings by 2°C to cut heating/cooling carbon impact',
      'Replace remaining incandescent lights with high-efficiency LEDs'
    ],
    water_saving_tips: [
      'Run dishwashers and washing machines only with full loads',
      'Harvest rainwater for gardening and non-potable outdoor uses'
    ],
    energy_saving_tips: [
      'Unplug phantom load electronics using smart power strips',
      'Schedule high-load appliances during off-peak grid hours'
    ],
    waste_reduction_plan: [
      'Audit single-use plastics and replace with durable reusables',
      'Separate organic waste to reduce methane production in landfills'
    ],
    priority_actions: [
      'Set an immediate goal to increase renewable energy share by 15%',
      'Conduct an energy audit on high-power consumption devices'
    ]
  };
}

/**
 * Analyzes sustainability data using Google Gemini SDK
 */
async function analyzeWithGemini(metrics) {
  const emissions = calculateEmissions(metrics);

  if (!ai) {
    console.log('ℹ️ Using EcoMind intelligent fallback engine for AI analysis');
    return generateFallbackAnalysis(metrics, emissions);
  }

  const prompt = `
You are EcoMind AI, an elite environmental scientist and sustainability advisor.
Analyze the following environmental resource tracking metrics and calculate exact sustainability recommendations:

METRICS SUBMITTED:
- Electricity: ${metrics.electricity_kwh} kWh
- Water Usage: ${metrics.water_liters} Liters
- Waste Generated: ${metrics.waste_kg} kg
- Fuel Usage: ${metrics.fuel_liters} Liters
- Public Transport: ${metrics.public_transport_km} km
- Renewable Energy Share: ${metrics.renewable_energy_pct}%
- Recycling Diversion Rate: ${metrics.recycling_pct}%
- Calculated Net CO2 Emissions: ${emissions.netEmissions} kg CO2e

TASK:
Return ONLY a valid JSON object matching this exact structure with detailed, actionable recommendations:
{
  "sustainability_score": 80,
  "summary": "concise executive summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "problems": ["problem 1", "problem 2"],
  "recommendations": ["rec 1", "rec 2", "rec 3"],
  "carbon_reduction_tips": ["tip 1", "tip 2"],
  "water_saving_tips": ["tip 1", "tip 2"],
  "energy_saving_tips": ["tip 1", "tip 2"],
  "waste_reduction_plan": ["plan 1", "plan 2"],
  "priority_actions": ["action 1", "action 2"]
}
`;

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    const cleanJsonText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const parsedData = JSON.parse(cleanJsonText);

    return {
      ...parsedData,
      emissions,
    };
  } catch (err) {
    console.error('⚠️ Gemini AI Call Error, falling back to intelligent rule engine:', err.message);
    return generateFallbackAnalysis(metrics, emissions);
  }
}

module.exports = {
  calculateEmissions,
  analyzeWithGemini,
};
