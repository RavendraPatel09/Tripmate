import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/asyncHandler';
import { prisma } from '@/lib/prisma';

export const achievementsRouter = Router();

achievementsRouter.use(requireAuth);

// Catalog (Achievement) + per-user progress (UserAchievement) are separate
// tables server-side, merged here into one flat object matching the
// frontend's `Achievement` interface (see API_CONTRACT.md Assumption 6).
// Progress is always looked up scoped to req.user.id.
achievementsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const [catalog, progress] = await Promise.all([
      prisma.achievement.findMany({ orderBy: { title: 'asc' } }),
      prisma.userAchievement.findMany({ where: { userId: req.user!.id } }),
    ]);

    const progressByAchievementId = new Map(progress.map((p) => [p.achievementId, p]));

    const achievements = catalog.map((a) => {
      const p = progressByAchievementId.get(a.id);
      return {
        id: a.id,
        title: a.title,
        description: a.description,
        icon: a.icon,
        progress: p?.progress ?? 0,
        maxProgress: a.maxProgress,
        isUnlocked: p?.isUnlocked ?? false,
      };
    });

    res.status(200).json({ achievements });
  }),
);
