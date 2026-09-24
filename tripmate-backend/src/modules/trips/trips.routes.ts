import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { asyncHandler } from '@/middleware/asyncHandler';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/AppError';
import { uuidParam, uuidParams } from '@/utils/commonSchemas';
import { findOwnedOrThrow, updateOwnedOrThrow, deleteOwnedOrThrow } from '@/utils/ownership';
import {
  createTripSchema,
  updateTripSchema,
  addTripMemberSchema,
  settleTripMemberSchema,
} from './trips.schemas';

export const tripsRouter = Router();

// Every route in this router requires auth, and every query below filters by
// `userId: req.user.id` at the query level (never a post-fetch/response-hiding
// check) — see utils/ownership.ts for the shared helper.
tripsRouter.use(requireAuth);

tripsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user!.id },
      orderBy: { startDate: 'asc' },
    });
    res.status(200).json({ trips });
  }),
);

tripsRouter.post(
  '/',
  validate({ body: createTripSchema }),
  asyncHandler(async (req, res) => {
    const trip = await prisma.trip.create({
      data: { ...req.body, userId: req.user!.id },
    });
    res.status(201).json({ trip });
  }),
);

tripsRouter.get(
  '/:tripId',
  validate({ params: uuidParam('tripId') }),
  asyncHandler(async (req, res) => {
    const trip = await findOwnedOrThrow(prisma.trip, req.params.tripId, req.user!.id, 'Trip');
    res.status(200).json({ trip });
  }),
);

tripsRouter.put(
  '/:tripId',
  validate({ params: uuidParam('tripId'), body: updateTripSchema }),
  asyncHandler(async (req, res) => {
    await updateOwnedOrThrow(prisma.trip, req.params.tripId, req.user!.id, req.body, 'Trip');
    const trip = await prisma.trip.findUnique({ where: { id: req.params.tripId } });
    res.status(200).json({ trip });
  }),
);

tripsRouter.delete(
  '/:tripId',
  validate({ params: uuidParam('tripId') }),
  asyncHandler(async (req, res) => {
    await deleteOwnedOrThrow(prisma.trip, req.params.tripId, req.user!.id, 'Trip');
    res.status(204).send();
  }),
);

// --- Trip members (group splitter) -----------------------------------------
// Nested under a trip; every route first confirms the trip is owned by the
// caller (404 otherwise) before touching any TripMember row.

tripsRouter.get(
  '/:tripId/members',
  validate({ params: uuidParam('tripId') }),
  asyncHandler(async (req, res) => {
    await findOwnedOrThrow(prisma.trip, req.params.tripId, req.user!.id, 'Trip');
    const members = await prisma.tripMember.findMany({
      where: { tripId: req.params.tripId },
      orderBy: { createdAt: 'asc' },
    });
    res.status(200).json({ members });
  }),
);

tripsRouter.post(
  '/:tripId/members',
  validate({ params: uuidParam('tripId'), body: addTripMemberSchema }),
  asyncHandler(async (req, res) => {
    await findOwnedOrThrow(prisma.trip, req.params.tripId, req.user!.id, 'Trip');
    const member = await prisma.tripMember.create({
      data: { tripId: req.params.tripId, name: req.body.name, avatar: req.body.avatar },
    });
    res.status(201).json({ member });
  }),
);

tripsRouter.patch(
  '/:tripId/members/:memberId/settle',
  validate({ params: uuidParams('tripId', 'memberId'), body: settleTripMemberSchema }),
  asyncHandler(async (req, res) => {
    await findOwnedOrThrow(prisma.trip, req.params.tripId, req.user!.id, 'Trip');
    const member = await prisma.tripMember.findFirst({
      where: { id: req.params.memberId, tripId: req.params.tripId },
    });
    if (!member) {
      throw AppError.notFound('Trip member not found');
    }
    const updated = await prisma.tripMember.update({
      where: { id: member.id },
      data: { balance: { increment: req.body.amount } },
    });
    res.status(200).json({ member: updated });
  }),
);

tripsRouter.delete(
  '/:tripId/members/:memberId',
  validate({ params: uuidParams('tripId', 'memberId') }),
  asyncHandler(async (req, res) => {
    await findOwnedOrThrow(prisma.trip, req.params.tripId, req.user!.id, 'Trip');
    const { count } = await prisma.tripMember.deleteMany({
      where: { id: req.params.memberId, tripId: req.params.tripId },
    });
    if (count === 0) {
      throw AppError.notFound('Trip member not found');
    }
    res.status(204).send();
  }),
);
