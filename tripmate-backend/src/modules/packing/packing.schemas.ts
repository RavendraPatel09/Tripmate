import { z } from 'zod';

const categoryEnum = z.enum(['Clothes', 'Electronics', 'Medicines', 'Documents', 'Accessories']);

export const createPackingItemSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    category: categoryEnum,
    tripId: z.string().uuid().optional(),
  })
  .strict();

export const updatePackingItemSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    category: categoryEnum.optional(),
    isPacked: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided' });

export const listPackingItemsQuerySchema = z
  .object({
    tripId: z.string().uuid().optional(),
  })
  .strict();
