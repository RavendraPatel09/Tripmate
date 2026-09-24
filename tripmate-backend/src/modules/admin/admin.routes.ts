import { Router } from 'express';
import { ZodTypeAny } from 'zod';
import { requireAuth } from '@/middleware/auth';
import { requireRole } from '@/middleware/requireRole';
import { validate } from '@/middleware/validate';
import { asyncHandler } from '@/middleware/asyncHandler';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/AppError';
import { uuidParam } from '@/utils/commonSchemas';
import {
  createDestinationSchema,
  updateDestinationSchema,
  createFoodItemSchema,
  updateFoodItemSchema,
  createHiddenGemSchema,
  updateHiddenGemSchema,
  createEventItemSchema,
  updateEventItemSchema,
  createEmergencyContactSchema,
  updateEmergencyContactSchema,
  createAchievementSchema,
  updateAchievementSchema,
  updateUserRoleSchema,
  listUsersQuerySchema,
} from './admin.schemas';

export const adminRouter = Router();

// Admin gate applied ONCE, here, at the router level — every route mounted
// below this line requires a valid session (requireAuth re-fetches the user
// from the DB) AND role === 'ADMIN' read from that same DB row. There is no
// other place in the codebase that grants admin access, and no route reads
// role from a client-supplied header/body/query field.
adminRouter.use(requireAuth, requireRole('ADMIN'));

interface CrudDelegate {
  create(args: { data: Record<string, unknown> }): Promise<unknown>;
  updateMany(args: { where: { id: string }; data: Record<string, unknown> }): Promise<{ count: number }>;
  deleteMany(args: { where: { id: string } }): Promise<{ count: number }>;
  findUnique(args: { where: { id: string } }): Promise<unknown>;
}

// Generic admin CRUD (create/update/delete) for the simple reference-data
// catalog tables. Public GETs for these live in their own modules
// (modules/destinations, modules/foods, ...) since reads are not admin-gated.
function catalogCrudRouter(delegate: CrudDelegate, createSchema: ZodTypeAny, updateSchema: ZodTypeAny, resourceName: string) {
  const router = Router();

  router.post(
    '/',
    validate({ body: createSchema }),
    asyncHandler(async (req, res) => {
      const created = await delegate.create({ data: req.body });
      res.status(201).json({ [resourceName]: created });
    }),
  );

  router.put(
    '/:id',
    validate({ params: uuidParam('id'), body: updateSchema }),
    asyncHandler(async (req, res) => {
      const { count } = await delegate.updateMany({ where: { id: req.params.id }, data: req.body });
      if (count === 0) {
        throw AppError.notFound(`${resourceName} not found`);
      }
      const updated = await delegate.findUnique({ where: { id: req.params.id } });
      res.status(200).json({ [resourceName]: updated });
    }),
  );

  router.delete(
    '/:id',
    validate({ params: uuidParam('id') }),
    asyncHandler(async (req, res) => {
      const { count } = await delegate.deleteMany({ where: { id: req.params.id } });
      if (count === 0) {
        throw AppError.notFound(`${resourceName} not found`);
      }
      res.status(204).send();
    }),
  );

  return router;
}

adminRouter.use('/destinations', catalogCrudRouter(prisma.destination, createDestinationSchema, updateDestinationSchema, 'destination'));
adminRouter.use('/foods', catalogCrudRouter(prisma.foodItem, createFoodItemSchema, updateFoodItemSchema, 'food'));
adminRouter.use('/hidden-gems', catalogCrudRouter(prisma.hiddenGem, createHiddenGemSchema, updateHiddenGemSchema, 'hiddenGem'));
adminRouter.use('/events', catalogCrudRouter(prisma.eventItem, createEventItemSchema, updateEventItemSchema, 'event'));
adminRouter.use(
  '/emergency-contacts',
  catalogCrudRouter(prisma.emergencyContact, createEmergencyContactSchema, updateEmergencyContactSchema, 'emergencyContact'),
);
adminRouter.use('/achievements', catalogCrudRouter(prisma.achievement, createAchievementSchema, updateAchievementSchema, 'achievement'));

// --- User management ---------------------------------------------------

adminRouter.get(
  '/users',
  validate({ query: listUsersQuerySchema }),
  asyncHandler(async (req, res) => {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count(),
    ]);
    res.status(200).json({ users, total, page, pageSize });
  }),
);

adminRouter.patch(
  '/users/:id/role',
  validate({ params: uuidParam('id'), body: updateUserRoleSchema }),
  asyncHandler(async (req, res) => {
    if (req.params.id === req.user!.id) {
      // Prevent an admin from locking themselves out by demoting their own account.
      throw AppError.badRequest('You cannot change your own role');
    }
    const { count } = await prisma.user.updateMany({ where: { id: req.params.id }, data: { role: req.body.role } });
    if (count === 0) {
      throw AppError.notFound('User not found');
    }
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, name: true, email: true, avatar: true, role: true },
    });
    res.status(200).json({ user });
  }),
);
