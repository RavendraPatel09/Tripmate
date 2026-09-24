import { Router } from 'express';
import { requireAuth, attachUserIfPresent } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { asyncHandler } from '@/middleware/asyncHandler';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/AppError';
import { uuidParam } from '@/utils/commonSchemas';
import { createPostSchema, createCommentSchema, listPostsQuerySchema } from './community.schemas';

export const communityRouter = Router();

// GET routes are public (matches the frontend: /community has no
// isAuthenticated redirect) but personalize `likedByMe` when a valid token is
// present. Every write requires auth.

communityRouter.get(
  '/posts',
  attachUserIfPresent,
  validate({ query: listPostsQuerySchema }),
  asyncHandler(async (req, res) => {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        _count: { select: { likes: true, comments: true } },
        ...(req.user ? { likes: { where: { userId: req.user.id }, select: { id: true } } } : {}),
      },
    });

    res.status(200).json({
      posts: posts.map((p) => ({
        id: p.id,
        author: p.author,
        content: p.content,
        image: p.image,
        location: p.location,
        createdAt: p.createdAt,
        likeCount: p._count.likes,
        commentCount: p._count.comments,
        likedByMe: (p.likes?.length ?? 0) > 0,
      })),
    });
  }),
);

communityRouter.post(
  '/posts',
  requireAuth,
  validate({ body: createPostSchema }),
  asyncHandler(async (req, res) => {
    const post = await prisma.communityPost.create({
      data: { ...req.body, authorId: req.user!.id },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });
    res.status(201).json({ post });
  }),
);

communityRouter.delete(
  '/posts/:id',
  requireAuth,
  validate({ params: uuidParam('id') }),
  asyncHandler(async (req, res) => {
    // Ownership check at the query level — a user can only delete their own post.
    const { count } = await prisma.communityPost.deleteMany({
      where: { id: req.params.id, authorId: req.user!.id },
    });
    if (count === 0) {
      throw AppError.notFound('Post not found');
    }
    res.status(204).send();
  }),
);

communityRouter.post(
  '/posts/:id/like',
  requireAuth,
  validate({ params: uuidParam('id') }),
  asyncHandler(async (req, res) => {
    const post = await prisma.communityPost.findUnique({ where: { id: req.params.id } });
    if (!post) {
      throw AppError.notFound('Post not found');
    }

    const existing = await prisma.postLike.findUnique({
      where: { postId_userId: { postId: post.id, userId: req.user!.id } },
    });

    if (existing) {
      await prisma.postLike.delete({ where: { id: existing.id } });
      res.status(200).json({ liked: false });
      return;
    }

    await prisma.postLike.create({ data: { postId: post.id, userId: req.user!.id } });
    res.status(200).json({ liked: true });
  }),
);

communityRouter.get(
  '/posts/:id/comments',
  validate({ params: uuidParam('id') }),
  asyncHandler(async (req, res) => {
    const comments = await prisma.postComment.findMany({
      where: { postId: req.params.id },
      orderBy: { createdAt: 'asc' },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });
    res.status(200).json({ comments });
  }),
);

communityRouter.post(
  '/posts/:id/comments',
  requireAuth,
  validate({ params: uuidParam('id'), body: createCommentSchema }),
  asyncHandler(async (req, res) => {
    const post = await prisma.communityPost.findUnique({ where: { id: req.params.id } });
    if (!post) {
      throw AppError.notFound('Post not found');
    }
    const comment = await prisma.postComment.create({
      data: { postId: post.id, authorId: req.user!.id, content: req.body.content },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });
    res.status(201).json({ comment });
  }),
);
