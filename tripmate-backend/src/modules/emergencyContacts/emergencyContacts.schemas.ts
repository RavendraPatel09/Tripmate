import { z } from 'zod';

export const listEmergencyContactsQuerySchema = z
  .object({
    city: z.string().trim().min(1).max(100).optional(),
  })
  .strict();
