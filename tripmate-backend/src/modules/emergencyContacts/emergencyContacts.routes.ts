import { Router } from 'express';
import { validate } from '@/middleware/validate';
import { asyncHandler } from '@/middleware/asyncHandler';
import { prisma } from '@/lib/prisma';
import { listEmergencyContactsQuerySchema } from './emergencyContacts.schemas';

export const emergencyContactsRouter = Router();

emergencyContactsRouter.get(
  '/',
  validate({ query: listEmergencyContactsQuerySchema }),
  asyncHandler(async (req, res) => {
    const { city } = req.query as { city?: string };
    const emergencyContacts = await prisma.emergencyContact.findMany({
      where: city ? { city } : undefined,
      orderBy: { name: 'asc' },
    });
    res.status(200).json({ emergencyContacts });
  }),
);
