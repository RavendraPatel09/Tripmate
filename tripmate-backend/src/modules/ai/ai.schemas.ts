import { z } from 'zod';

export const generateItinerarySchema = z
  .object({
    origin: z.string().trim().min(1).max(140),
    destination: z.string().trim().max(140).optional(),
    budget: z.number().positive().max(100_000_000),
    days: z.number().int().min(1).max(90),
  })
  .strict();
