import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { asyncHandler } from '@/middleware/asyncHandler';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/AppError';
import { uuidParam } from '@/utils/commonSchemas';
import { deleteOwnedOrThrow } from '@/utils/ownership';
import { createExpenseSchema, listExpensesQuerySchema } from './expenses.schemas';

export const expensesRouter = Router();

expensesRouter.use(requireAuth);

expensesRouter.get(
  '/',
  validate({ query: listExpensesQuerySchema }),
  asyncHandler(async (req, res) => {
    const { tripId } = req.query as { tripId?: string };
    const expenses = await prisma.expense.findMany({
      where: { userId: req.user!.id, ...(tripId ? { tripId } : {}) },
      orderBy: { date: 'desc' },
    });
    res.status(200).json({ expenses });
  }),
);

expensesRouter.get(
  '/summary',
  validate({ query: listExpensesQuerySchema }),
  asyncHandler(async (req, res) => {
    const { tripId } = req.query as { tripId?: string };
    const grouped = await prisma.expense.groupBy({
      by: ['category'],
      where: { userId: req.user!.id, ...(tripId ? { tripId } : {}) },
      _sum: { amount: true },
    });
    const totalSpent = grouped.reduce((sum, row) => sum + Number(row._sum.amount ?? 0), 0);
    res.status(200).json({
      totalSpent,
      byCategory: grouped.map((row) => ({ category: row.category, total: Number(row._sum.amount ?? 0) })),
    });
  }),
);

expensesRouter.post(
  '/',
  validate({ body: createExpenseSchema }),
  asyncHandler(async (req, res) => {
    if (req.body.tripId) {
      const trip = await prisma.trip.findFirst({ where: { id: req.body.tripId, userId: req.user!.id } });
      if (!trip) {
        throw AppError.badRequest('Trip does not exist');
      }
    }
    const expense = await prisma.expense.create({
      data: { ...req.body, userId: req.user!.id },
    });
    res.status(201).json({ expense });
  }),
);

expensesRouter.delete(
  '/:id',
  validate({ params: uuidParam('id') }),
  asyncHandler(async (req, res) => {
    await deleteOwnedOrThrow(prisma.expense, req.params.id, req.user!.id, 'Expense');
    res.status(204).send();
  }),
);
