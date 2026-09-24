import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { asyncHandler } from '@/middleware/asyncHandler';
import { planRouteSchema } from './planner.schemas';
import { generateRouteOptions } from './planner.service';

export const plannerRouter = Router();

plannerRouter.use(requireAuth);

plannerRouter.post(
  '/routes',
  validate({ body: planRouteSchema }),
  asyncHandler(async (req, res) => {
    const { origin, destination } = req.body;
    const routes = generateRouteOptions(origin, destination);
    res.status(200).json({ routes });
  }),
);
