const { z } = require('zod');

const usageInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be YYYY-MM-DD' }).optional(),
  electricity_kwh: z.number().min(0, 'Electricity usage cannot be negative').default(0),
  water_liters: z.number().min(0, 'Water usage cannot be negative').default(0),
  waste_kg: z.number().min(0, 'Waste generated cannot be negative').default(0),
  fuel_liters: z.number().min(0, 'Fuel usage cannot be negative').default(0),
  public_transport_km: z.number().min(0, 'Public transport km cannot be negative').default(0),
  renewable_energy_pct: z.number().min(0).max(100, 'Renewable energy percentage must be 0-100').default(0),
  recycling_pct: z.number().min(0).max(100, 'Recycling percentage must be 0-100').default(0),
  notes: z.string().optional(),
});

const usageQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(30),
  page: z.coerce.number().min(1).default(1),
});

const uuidParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid Resource Usage ID' }),
});

module.exports = {
  usageInputSchema,
  usageQuerySchema,
  uuidParamSchema,
};
