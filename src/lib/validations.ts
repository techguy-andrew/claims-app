import { z } from 'zod'

// Claim validation schemas
export const claimUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED']),
  amount: z.number().positive('Amount must be positive').optional(),
})

export const claimCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED']).default('PENDING'),
  amount: z.number().positive('Amount must be positive').optional(),
  claimantId: z.string().cuid('Invalid claimant ID'),
})

// Item validation schemas
export const itemUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().optional(),
})

export const itemCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().optional(),
  claimId: z.string().cuid('Invalid claim ID'),
})

// Type exports
export type ClaimUpdateInput = z.infer<typeof claimUpdateSchema>
export type ClaimCreateInput = z.infer<typeof claimCreateSchema>
export type ItemUpdateInput = z.infer<typeof itemUpdateSchema>
export type ItemCreateInput = z.infer<typeof itemCreateSchema>