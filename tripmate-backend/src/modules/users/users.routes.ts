import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { asyncHandler } from '@/middleware/asyncHandler';
import { prisma } from '@/lib/prisma';
import { updateMeSchema } from './users.schemas';

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.patch(
  '/me',
  validate({ body: updateMeSchema }),
  asyncHandler(async (req, res) => {
    // Scoped to req.user.id — a user can only ever update their own row.
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(req.body.name !== undefined ? { name: req.body.name } : {}),
        ...(req.body.avatar !== undefined ? { avatar: req.body.avatar } : {}),
      },
      select: { id: true, name: true, email: true, avatar: true },
    });
    res.status(200).json({ user });
  }),
);
