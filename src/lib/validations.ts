import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
})

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().optional(),
  published: z.boolean().default(false),
})

export type UserInput = z.infer<typeof userSchema>
export type PostInput = z.infer<typeof postSchema>