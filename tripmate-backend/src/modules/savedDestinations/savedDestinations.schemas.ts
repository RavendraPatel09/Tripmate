import { z } from 'zod';

export const addSavedDestinationSchema = z
  .object({
    destinationId: z.string().uuid(),
  })
  .strict();
