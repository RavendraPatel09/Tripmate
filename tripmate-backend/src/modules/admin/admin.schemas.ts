import { z } from 'zod';

// Accepts the same public-facing values the frontend's Destination type uses
// (`'budget' | 'mid-range' | 'luxury'`), then maps to the DB enum
// (`mid_range` — a Prisma enum member can't contain a hyphen) so admin
// requests and public reads use one consistent vocabulary.
const budgetTierInputEnum = z
  .enum(['budget', 'mid-range', 'luxury'])
  .default('mid-range')
  .transform((val) => (val === 'mid-range' ? 'mid_range' : val));

export const createDestinationSchema = z
  .object({
    name: z.string().trim().min(1).max(140),
    description: z.string().trim().min(1).max(2000),
    image: z.string().trim().url().max(2048),
    rating: z.number().min(0).max(5).default(0),
    weather: z.string().trim().max(60).optional(),
    budgetTier: budgetTierInputEnum,
    distance: z.string().trim().max(60).optional(),
    categories: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
    travelTime: z.string().trim().max(60).optional(),
    popularityScore: z.number().int().min(0).max(100).default(0),
  })
  .strict();

export const updateDestinationSchema = createDestinationSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export const createFoodItemSchema = z
  .object({
    name: z.string().trim().min(1).max(140),
    image: z.string().trim().url().max(2048),
    price: z.number().nonnegative().max(1_000_000),
    rating: z.number().min(0).max(5).default(0),
    location: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(1000),
    category: z.enum(['vegetarian', 'non-vegetarian', 'dessert', 'street food', 'local specialty']),
  })
  .strict();

export const updateFoodItemSchema = createFoodItemSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export const createHiddenGemSchema = z
  .object({
    name: z.string().trim().min(1).max(140),
    photos: z.array(z.string().trim().url().max(2048)).max(20).default([]),
    description: z.string().trim().min(1).max(2000),
    crowdLevel: z.enum(['low', 'medium', 'high']),
    difficultyLevel: z.enum(['easy', 'moderate', 'hard']),
    localTips: z.string().trim().min(1).max(1000),
    bestSeason: z.string().trim().min(1).max(140),
    estimatedBudget: z.number().nonnegative().max(10_000_000),
  })
  .strict();

export const updateHiddenGemSchema = createHiddenGemSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export const createEventItemSchema = z
  .object({
    name: z.string().trim().min(1).max(140),
    date: z.string().trim().min(1).max(60),
    location: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(2000),
    popularity: z.number().int().min(0).max(100).default(0),
    image: z.string().trim().url().max(2048),
  })
  .strict();

export const updateEventItemSchema = createEventItemSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export const createEmergencyContactSchema = z
  .object({
    name: z.string().trim().min(1).max(140),
    type: z.enum(['Hospital', 'Police', 'Petrol Pump', 'ATM', 'Pharmacy']),
    phone: z.string().trim().min(1).max(30),
    distance: z.string().trim().max(60).optional(),
    address: z.string().trim().min(1).max(300),
    city: z.string().trim().max(100).optional(),
  })
  .strict();

export const updateEmergencyContactSchema = createEmergencyContactSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export const createAchievementSchema = z
  .object({
    title: z.string().trim().min(1).max(140),
    description: z.string().trim().min(1).max(1000),
    icon: z.string().trim().min(1).max(60),
    maxProgress: z.number().int().min(1).max(1000).default(1),
  })
  .strict();

export const updateAchievementSchema = createAchievementSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export const updateUserRoleSchema = z
  .object({
    role: z.enum(['USER', 'ADMIN']),
  })
  .strict();

export const listUsersQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();
