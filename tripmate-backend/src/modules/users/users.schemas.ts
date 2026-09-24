import { z } from 'zod';

export const updateMeSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    avatar: z.string().trim().url().max(2048).nullable().optional(),
  })
  .strict()
  .refine((data) => data.name !== undefined || data.avatar !== undefined, {
    message: 'At least one field must be provided',
  });
