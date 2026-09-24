import { Router } from 'express';
import { asyncHandler } from '@/middleware/asyncHandler';
import { prisma } from '@/lib/prisma';

export const foodsRouter = Router();

foodsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const foods = await prisma.foodItem.findMany({ orderBy: { rating: 'desc' } });
    res.status(200).json({ foods });
  }),
);
