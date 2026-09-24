import { Router } from 'express';
import { asyncHandler } from '@/middleware/asyncHandler';
import { prisma } from '@/lib/prisma';

export const hiddenGemsRouter = Router();

hiddenGemsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const hiddenGems = await prisma.hiddenGem.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ hiddenGems });
  }),
);
