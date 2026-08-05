const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(100),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  organization: z.string().optional().default('Individual User'),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  organization: z.string().optional(),
  avatar_url: z.string().url().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
};
