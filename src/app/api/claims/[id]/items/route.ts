import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/claims/[id]/items - List all items for a claim
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const items = await prisma.claimItem.findMany({
      where: { claimId: id },
      include: {
        files: {
          orderBy: { uploadedAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching claim items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch claim items' },
      { status: 500 }
    )
  }
}

// POST /api/claims/[id]/items - Create new item for a claim
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { itemName, details } = body

    // Validate required fields
    if (!itemName?.trim()) {
      return NextResponse.json(
        { error: 'Item name is required' },
        { status: 400 }
      )
    }

    // Check if claim exists
    const claim = await prisma.claim.findUnique({
      where: { id }
    })

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    const item = await prisma.claimItem.create({
      data: {
        claimId: id,
        itemName: itemName.trim(),
        details: details?.trim() || null
      },
      include: {
        files: {
          orderBy: { uploadedAt: 'desc' }
        }
      }
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating claim item:', error)
    return NextResponse.json(
      { error: 'Failed to create claim item' },
      { status: 500 }
    )
  }
}