import { z } from 'zod';

export const estimateBudgetSchema = z
  .object({
    destination: z.string().trim().min(1).max(140),
    totalBudget: z.number().positive().max(100_000_000),
    travelers: z.number().int().min(1).max(50),
    days: z.number().int().min(1).max(90),
  })
  .strict();
