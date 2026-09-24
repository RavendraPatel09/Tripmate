import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { asyncHandler } from '@/middleware/asyncHandler';
import { estimateBudgetSchema } from './budget.schemas';

export const budgetRouter = Router();

budgetRouter.use(requireAuth);

// Deterministic, rule-based percentage split — NOT a real "AI" estimate (the
// mock UI's copy says "AI-powered" but is just a hardcoded object). See
// API_CONTRACT.md Assumption 3. Percentages mirror the original mock's ratios.
const ALLOCATION: Record<string, number> = {
  hotel: 0.375,
  food: 0.2,
  localTransport: 0.075,
  activities: 0.125,
  shopping: 0.1,
  emergencyFund: 0.125,
};

budgetRouter.post(
  '/estimate',
  validate({ body: estimateBudgetSchema }),
  asyncHandler(async (req, res) => {
    const { totalBudget } = req.body;
    const keys = Object.keys(ALLOCATION);
    const rounded: Record<string, number> = {};
    let runningTotal = 0;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        // Last bucket absorbs rounding drift so the components sum exactly to totalBudget.
        rounded[key] = Math.round((totalBudget - runningTotal) * 100) / 100;
      } else {
        const value = Math.round(totalBudget * ALLOCATION[key]! * 100) / 100;
        rounded[key] = value;
        runningTotal += value;
      }
    });

    res.status(200).json({
      estimate: {
        hotel: rounded.hotel,
        food: rounded.food,
        localTransport: rounded.localTransport,
        activities: rounded.activities,
        shopping: rounded.shopping,
        emergencyFund: rounded.emergencyFund,
        total: totalBudget,
      },
    });
  }),
);
