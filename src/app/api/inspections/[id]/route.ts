import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { validateSequentialNumber, reserveSequentialNumber } from '@/lib/sequential-numbers'

const prisma = new PrismaClient()

// GET /api/inspections/[id] - Get single inspection
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const inspection = await prisma.inspection.findUnique({
      where: { id },
      include: {
        inspector: {
          select: { firstName: true, lastName: true, email: true }
        },
        claim: {
          select: { 
            id: true,
            claimNumber: true, 
            sequentialNumber: true,
            clientName: true, 
            itemDescription: true,
            damageDetails: true,
            status: true 
          }
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

    if (!inspection) {
      return NextResponse.json(
        { error: 'Inspection not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(inspection)
  } catch (error) {
    console.error('Error fetching inspection:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inspection' },
      { status: 500 }
    )
  }
}

// PUT /api/inspections/[id] - Update inspection
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const {
      inspectionDate,
      inspectorNotes,
      damageAssessment,
      photos,
      sequentialNumber
    } = body

    // Check if inspection exists
    const existingInspection = await prisma.inspection.findUnique({
      where: { id }
    })

    if (!existingInspection) {
      return NextResponse.json(
        { error: 'Inspection not found' },
        { status: 404 }
      )
    }

    // Handle sequential number update if provided
    type UpdateInspectionData = {
      inspectionDate?: Date;
      inspectorNotes?: string | null;
      damageAssessment?: string | null;
      photos?: string[];
      sequentialNumber?: number;
    }

    const updateData: UpdateInspectionData = {
      inspectionDate: inspectionDate ? new Date(inspectionDate) : undefined,
      inspectorNotes,
      damageAssessment,
      photos: photos || existingInspection.photos
    }

    if (sequentialNumber !== undefined && sequentialNumber !== existingInspection.sequentialNumber) {
      // Validate the new sequential number
      const validation = await validateSequentialNumber('INSPECTION', sequentialNumber, id)
      if (!validation.isValid) {
        return NextResponse.json(
          { error: validation.message },
          { status: 400 }
        )
      }
      updateData.sequentialNumber = sequentialNumber
      // Reserve this number to prevent conflicts
      await reserveSequentialNumber('INSPECTION', sequentialNumber)
    }

    const inspection = await prisma.inspection.update({
      where: { id },
      data: updateData,
      include: {
        inspector: {
          select: { firstName: true, lastName: true, email: true }
        },
        claim: {
          select: { 
            claimNumber: true, 
            sequentialNumber: true,
            clientName: true, 
            itemDescription: true 
          }
        }
      }
    })

    return NextResponse.json(inspection)
  } catch (error) {
    console.error('Error updating inspection:', error)
    return NextResponse.json(
      { error: 'Failed to update inspection' },
      { status: 500 }
    )
  }
}

// DELETE /api/inspections/[id] - Delete inspection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if inspection exists
    const existingInspection = await prisma.inspection.findUnique({
      where: { id }
    })

    if (!existingInspection) {
      return NextResponse.json(
        { error: 'Inspection not found' },
        { status: 404 }
      )
    }

    await prisma.inspection.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Inspection deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting inspection:', error)
    return NextResponse.json(
      { error: 'Failed to delete inspection' },
      { status: 500 }
    )
  }
}