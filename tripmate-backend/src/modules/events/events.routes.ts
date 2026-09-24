import { Router } from 'express';
import { asyncHandler } from '@/middleware/asyncHandler';
import { prisma } from '@/lib/prisma';

export const eventsRouter = Router();

eventsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const events = await prisma.eventItem.findMany({ orderBy: { popularity: 'desc' } });
    res.status(200).json({ events });
  }),
);
