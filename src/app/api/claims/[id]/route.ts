import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { validateSequentialNumber, reserveSequentialNumber } from '@/lib/sequential-numbers'

const prisma = new PrismaClient()

// GET /api/claims/[id] - Get single claim
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const claim = await prisma.claim.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { firstName: true, lastName: true, email: true }
        },
        organization: {
          select: { name: true }
        },
        inspections: {
          include: {
            inspector: {
              select: { firstName: true, lastName: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        auditLogs: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
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
      { error: 'Failed to fetch claim' },
      { status: 500 }
    )
  }
}

// PUT /api/claims/[id] - Update claim
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const {
      clientName,
      clientEmail,
      clientPhone,
      itemDescription,
      damageDetails,
      status,
      incidentDate,
      sequentialNumber
    } = body

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

    // Handle sequential number update if provided
    const updateData: any = {
      clientName,
      clientEmail,
      clientPhone,
      itemDescription,
      damageDetails,
      status,
      incidentDate: incidentDate ? new Date(incidentDate) : null
    }

    if (sequentialNumber !== undefined && sequentialNumber !== existingClaim.sequentialNumber) {
      // Validate the new sequential number
      const validation = await validateSequentialNumber('CLAIM', sequentialNumber, id)
      if (!validation.isValid) {
        return NextResponse.json(
          { error: validation.message },
          { status: 400 }
        )
      }
      updateData.sequentialNumber = sequentialNumber
      // Reserve this number to prevent conflicts
      await reserveSequentialNumber('CLAIM', sequentialNumber)
    }

    const claim = await prisma.claim.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: { firstName: true, lastName: true, email: true }
        },
        organization: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json(claim)
  } catch (error) {
    console.error('Error updating claim:', error)
    return NextResponse.json(
      { error: 'Failed to update claim' },
      { status: 500 }
    )
  }
}

// DELETE /api/claims/[id] - Delete claim
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
      { error: 'Failed to delete claim' },
      { status: 500 }
    )
  }
}