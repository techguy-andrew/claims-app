import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema
const updateClaimSchema = z.object({
  claimNumber: z.string().min(1, 'Claim number is required'),
  insuranceCompany: z.string().min(1, 'Insurance company is required'),
  clientPhone: z.string().min(1, 'Client phone is required'),
  clientAddress: z.string().min(1, 'Client address is required'),
})

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/claims/[id] - Get single claim
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const claim = await prisma.claim.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { createdAt: 'asc' }
        },
        claimant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(claim)
  } catch (error) {
    console.error('Error fetching claim:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/claims/[id] - Update claim
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate request body
    const validation = updateClaimSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { claimNumber, insuranceCompany, clientPhone, clientAddress } = validation.data

    // Check if claim exists
    const existingClaim = await prisma.claim.findUnique({
      where: { id }
    })

    if (!existingClaim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    // Update claim
    const updatedClaim = await prisma.claim.update({
      where: { id },
      data: {
        claimNumber,
        insuranceCompany,
        clientPhone,
        clientAddress,
        updatedAt: new Date()
      },
      include: {
        items: {
          orderBy: { createdAt: 'asc' }
        },
        claimant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedClaim)
  } catch (error) {
    console.error('Error updating claim:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/claims/[id] - Delete claim
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if claim exists
    const existingClaim = await prisma.claim.findUnique({
      where: { id }
    })

    if (!existingClaim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    // Delete claim (cascade will handle items)
    await prisma.claim.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Claim deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting claim:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}