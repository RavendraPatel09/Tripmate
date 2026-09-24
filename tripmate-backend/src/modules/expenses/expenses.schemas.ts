import { z } from 'zod';

const categoryEnum = z.enum(['Food', 'Transport', 'Hotel', 'Shopping', 'Activities']);

export const createExpenseSchema = z
  .object({
    amount: z.number().positive().max(10_000_000),
    category: categoryEnum,
    description: z.string().trim().min(1).max(200),
    date: z.coerce.date(),
    tripId: z.string().uuid().optional(),
  })
  .strict();

export const listExpensesQuerySchema = z
  .object({
    tripId: z.string().uuid().optional(),
  })
  .strict();
