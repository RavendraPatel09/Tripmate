import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { asyncHandler } from '@/middleware/asyncHandler';
import { prisma } from '@/lib/prisma';
import { uuidParam } from '@/utils/commonSchemas';
import { updateOwnedOrThrow, deleteOwnedOrThrow } from '@/utils/ownership';

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    res.status(200).json({ notifications, unreadCount });
  }),
);

notificationsRouter.patch(
  '/read-all',
  asyncHandler(async (req, res) => {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data: { isRead: true },
    });
    res.status(204).send();
  }),
);

notificationsRouter.patch(
  '/:id/read',
  validate({ params: uuidParam('id') }),
  asyncHandler(async (req, res) => {
    await updateOwnedOrThrow(prisma.notification, req.params.id, req.user!.id, { isRead: true }, 'Notification');
    res.status(204).send();
  }),
);

notificationsRouter.delete(
  '/:id',
  validate({ params: uuidParam('id') }),
  asyncHandler(async (req, res) => {
    await deleteOwnedOrThrow(prisma.notification, req.params.id, req.user!.id, 'Notification');
    res.status(204).send();
  }),
);
