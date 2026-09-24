import { Router } from 'express';
import { validate } from '@/middleware/validate';
import { asyncHandler } from '@/middleware/asyncHandler';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/AppError';
import { uuidParam } from '@/utils/commonSchemas';
import { toPublicDestination } from './destinations.serializer';

// Public catalog data — matches the frontend, where /explore and
// /destination/[id] are not behind the isAuthenticated redirect that
// /dashboard uses. Mutations live under /api/admin (see modules/admin).
export const destinationsRouter = Router();

destinationsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const destinations = await prisma.destination.findMany({ orderBy: { popularityScore: 'desc' } });
    res.status(200).json({ destinations: destinations.map(toPublicDestination) });
  }),
);

destinationsRouter.get(
  '/:id',
  validate({ params: uuidParam('id') }),
  asyncHandler(async (req, res) => {
    const destination = await prisma.destination.findUnique({ where: { id: req.params.id } });
    if (!destination) {
      throw AppError.notFound('Destination not found');
    }
    res.status(200).json({ destination: toPublicDestination(destination) });
  }),
);
