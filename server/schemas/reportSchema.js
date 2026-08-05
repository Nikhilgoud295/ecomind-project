const { z } = require('zod');

const generateReportSchema = z.object({
  type: z.enum(['daily', 'weekly', 'monthly']),
  title: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

module.exports = {
  generateReportSchema,
};
