const { z } = require('zod');

const analyzeSchema = z.object({
  usageId: z.string().uuid().optional(),
  electricity_kwh: z.number().min(0).default(0),
  water_liters: z.number().min(0).default(0),
  waste_kg: z.number().min(0).default(0),
  fuel_liters: z.number().min(0).default(0),
  public_transport_km: z.number().min(0).default(0),
  renewable_energy_pct: z.number().min(0).max(100).default(0),
  recycling_pct: z.number().min(0).max(100).default(0),
});

module.exports = {
  analyzeSchema,
};
