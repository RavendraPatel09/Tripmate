import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { asyncHandler } from '@/middleware/asyncHandler';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/AppError';
import { uuidParam } from '@/utils/commonSchemas';
import { updateOwnedOrThrow, deleteOwnedOrThrow } from '@/utils/ownership';
import { createPackingItemSchema, updatePackingItemSchema, listPackingItemsQuerySchema } from './packing.schemas';

export const packingRouter = Router();

packingRouter.use(requireAuth);

packingRouter.get(
  '/',
  validate({ query: listPackingItemsQuerySchema }),
  asyncHandler(async (req, res) => {
    const { tripId } = req.query as { tripId?: string };
    const packingItems = await prisma.packingItem.findMany({
      where: { userId: req.user!.id, ...(tripId ? { tripId } : {}) },
      orderBy: { createdAt: 'asc' },
    });
    res.status(200).json({ packingItems });
  }),
);

packingRouter.post(
  '/',
  validate({ body: createPackingItemSchema }),
  asyncHandler(async (req, res) => {
    if (req.body.tripId) {
      // Defense in depth: don't let a user attach an item to a trip they
      // don't own, even though it would never surface back to them either way.
      const trip = await prisma.trip.findFirst({ where: { id: req.body.tripId, userId: req.user!.id } });
      if (!trip) {
        throw AppError.badRequest('Trip does not exist');
      }
    }
    const item = await prisma.packingItem.create({
      data: { ...req.body, userId: req.user!.id },
    });
    res.status(201).json({ packingItem: item });
  }),
);

packingRouter.patch(
  '/:id',
  validate({ params: uuidParam('id'), body: updatePackingItemSchema }),
  asyncHandler(async (req, res) => {
    await updateOwnedOrThrow(prisma.packingItem, req.params.id, req.user!.id, req.body, 'Packing item');
    const item = await prisma.packingItem.findUnique({ where: { id: req.params.id } });
    res.status(200).json({ packingItem: item });
  }),
);

packingRouter.delete(
  '/:id',
  validate({ params: uuidParam('id') }),
  asyncHandler(async (req, res) => {
    await deleteOwnedOrThrow(prisma.packingItem, req.params.id, req.user!.id, 'Packing item');
    res.status(204).send();
  }),
);
