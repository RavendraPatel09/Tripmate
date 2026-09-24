import { z } from 'zod';

export const createPostSchema = z
  .object({
    content: z.string().trim().min(1).max(2000),
    image: z.string().trim().url().max(2048).optional(),
    location: z.string().trim().max(140).optional(),
  })
  .strict();

export const createCommentSchema = z
  .object({
    content: z.string().trim().min(1).max(500),
  })
  .strict();

export const listPostsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(20),
  })
  .strict();
