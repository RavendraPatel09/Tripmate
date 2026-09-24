import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { asyncHandler } from '@/middleware/asyncHandler';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/AppError';
import { uuidParam } from '@/utils/commonSchemas';
import { addSavedDestinationSchema } from './savedDestinations.schemas';
import { toPublicDestination } from '@/modules/destinations/destinations.serializer';
import type { SavedListType } from '@prisma/client';

export const meRouter = Router();

meRouter.use(requireAuth);

function buildListRouter(listType: SavedListType) {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const rows = await prisma.savedDestination.findMany({
        where: { userId: req.user!.id, listType },
        include: { destination: true },
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json({ destinations: rows.map((r) => toPublicDestination(r.destination)) });
    }),
  );

  router.post(
    '/',
    validate({ body: addSavedDestinationSchema }),
    asyncHandler(async (req, res) => {
      const destination = await prisma.destination.findUnique({ where: { id: req.body.destinationId } });
      if (!destination) {
        throw AppError.badRequest('Destination does not exist');
      }
      const saved = await prisma.savedDestination
        .create({
          data: { userId: req.user!.id, destinationId: destination.id, listType },
        })
        .catch((err: unknown) => {
          // Unique constraint on (userId, destinationId, listType) — already saved.
          if (err && typeof err === 'object' && 'code' in err && (err as { code?: string }).code === 'P2002') {
            throw AppError.conflict('Already added to this list');
          }
          throw err;
        });
      res.status(201).json({ saved: { id: saved.id, destination: toPublicDestination(destination) } });
    }),
  );

  router.delete(
    '/:destinationId',
    validate({ params: uuidParam('destinationId') }),
    asyncHandler(async (req, res) => {
      // Scoped by userId + listType — a user can only ever remove their own entries.
      const { count } = await prisma.savedDestination.deleteMany({
        where: { userId: req.user!.id, destinationId: req.params.destinationId, listType },
      });
      if (count === 0) {
        throw AppError.notFound('Not found in this list');
      }
      res.status(204).send();
    }),
  );

  return router;
}

meRouter.use('/wishlist', buildListRouter('WISHLIST'));
meRouter.use('/saved-trips', buildListRouter('SAVED'));
