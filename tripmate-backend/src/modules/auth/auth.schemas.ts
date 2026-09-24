import { z } from 'zod';

// `.strict()` on every body schema rejects unknown fields outright — a client
// can't sneak an extra `role: "ADMIN"` or `isVerified: true` into a request body.
export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
    email: z.string().trim().toLowerCase().email('Please enter a valid email address').max(255),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128)
      .refine((val) => /[a-zA-Z]/.test(val) && /[0-9\W]/.test(val), {
        message: 'Password must contain a letter and a number or symbol',
      }),
    confirmPassword: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Please enter a valid email address').max(255),
    password: z.string().min(1).max(128),
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Please enter a valid email address').max(255),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1).max(256),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128)
      .refine((val) => /[a-zA-Z]/.test(val) && /[0-9\W]/.test(val), {
        message: 'Password must contain a letter and a number or symbol',
      }),
  })
  .strict();
