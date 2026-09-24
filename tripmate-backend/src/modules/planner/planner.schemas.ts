import { z } from 'zod';

export const planRouteSchema = z
  .object({
    origin: z.string().trim().min(1).max(140),
    destination: z.string().trim().min(1).max(140),
    date: z.coerce.date().optional(),
  })
  .strict();
