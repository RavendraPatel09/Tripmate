import { z } from 'zod';

const tripStatusEnum = z.enum(['PLANNING', 'UPCOMING', 'COMPLETED', 'CANCELLED']);

export const createTripSchema = z
  .object({
    title: z.string().trim().min(1).max(140),
    originName: z.string().trim().max(140).optional(),
    destinationName: z.string().trim().min(1).max(140),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    budgetTotal: z.number().nonnegative().max(100_000_000).optional(),
    travelers: z.number().int().min(1).max(50).default(1),
    status: tripStatusEnum.optional(),
  })
  .strict()
  .refine((data) => data.endDate >= data.startDate, {
    message: 'endDate must be on or after startDate',
    path: ['endDate'],
  });

export const updateTripSchema = z
  .object({
    title: z.string().trim().min(1).max(140).optional(),
    originName: z.string().trim().max(140).nullable().optional(),
    destinationName: z.string().trim().min(1).max(140).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    budgetTotal: z.number().nonnegative().max(100_000_000).nullable().optional(),
    travelers: z.number().int().min(1).max(50).optional(),
    status: tripStatusEnum.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided' });

export const addTripMemberSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    avatar: z.string().trim().url().max(2048).optional(),
  })
  .strict();

export const settleTripMemberSchema = z
  .object({
    amount: z.number().finite(),
  })
  .strict();
