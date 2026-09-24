import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { asyncHandler } from '@/middleware/asyncHandler';
import { aiGeneratorRateLimiter } from '@/middleware/rateLimiters';
import { generateItinerarySchema } from './ai.schemas';

export const aiRouter = Router();

aiRouter.use(requireAuth);

// Stubbed per explicit product decision (see API_CONTRACT.md Assumption 2):
// deterministic templated output, no external LLM API key/cost. Swappable
// for a real provider later behind this same route contract.
aiRouter.post(
  '/generate-itinerary',
  aiGeneratorRateLimiter,
  validate({ body: generateItinerarySchema }),
  asyncHandler(async (req, res) => {
    const { origin, destination, budget, days } = req.body;
    const dest = destination || 'a nearby destination that fits your budget';
    const perDay = Math.round(budget / days);

    const message =
      `Based on a budget of ₹${budget.toLocaleString('en-IN')} and ${days} day${days > 1 ? 's' : ''} ` +
      `from ${origin}, here's a starting plan for ${dest} (~₹${perDay.toLocaleString('en-IN')}/day):\n\n` +
      `### Budget Breakdown\n` +
      `- Transport: ₹${Math.round(budget * 0.15).toLocaleString('en-IN')}\n` +
      `- Accommodation: ₹${Math.round(budget * 0.35).toLocaleString('en-IN')}\n` +
      `- Food: ₹${Math.round(budget * 0.25).toLocaleString('en-IN')}\n` +
      `- Activities: ₹${Math.round(budget * 0.15).toLocaleString('en-IN')}\n` +
      `- Emergency fund: ₹${Math.round(budget * 0.1).toLocaleString('en-IN')}\n\n` +
      `### Itinerary sketch\n` +
      Array.from({ length: days })
        .map((_, i) => `**Day ${i + 1}:** Explore ${dest} — sightseeing, local food, and rest.`)
        .join('\n');

    res.status(200).json({ message });
  }),
);
