import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema
const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/claims/[id]/items - Get items for a claim
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id: claimId } = await params

    // Check if claim exists
    const claim = await prisma.claim.findUnique({
      where: { id: claimId }
    })

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    const items = await prisma.item.findMany({
      where: { claimId },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/claims/[id]/items - Create new item for a claim
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: claimId } = await params
    const body = await request.json()

    // Validate request body
    const validation = createItemSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { title, description } = validation.data

    // Check if claim exists
    const claim = await prisma.claim.findUnique({
      where: { id: claimId }
    })

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    // Create item
    const newItem = await prisma.item.create({
      data: {
        title,
        description,
        claimId
      }
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}