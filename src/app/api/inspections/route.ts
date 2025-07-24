import { NextRequest, NextResponse } from 'next/server'
import { createInspectionNumber, validateId } from '@/lib/random-ids'
import { prisma } from '@/lib/prisma'

// GET /api/inspections - List all inspections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const claimId = searchParams.get('claimId')
    const inspectorId = searchParams.get('inspectorId')

    const skip = (page - 1) * limit

    interface InspectionWhere {
      claimId?: string;
      inspectorId?: string;
    }

    const where: InspectionWhere = {}
    
    if (claimId) {
      where.claimId = claimId
    }
    
    if (inspectorId) {
      where.inspectorId = inspectorId
    }

    const [inspections, total] = await Promise.all([
      prisma.inspection.findMany({
        where,
        skip,
        take: limit,
        orderBy: { inspectionDate: 'desc' },
        include: {
          inspector: {
            select: { firstName: true, lastName: true, email: true }
          },
          claim: {
            select: { 
              claimNumber: true,
              clientName: true, 
              itemDescription: true, 
              status: true 
            }
          }
        }
      }),
      prisma.inspection.count({ where })
    ])

    return NextResponse.json({
      inspections,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching inspections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inspections' },
      { status: 500 }
    )
  }
}

// POST /api/inspections - Create new inspection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      inspectionDate,
      inspectorNotes,
      damageAssessment,
      photos,
      claimId,
      inspectorId,
      inspectionNumber: providedInspectionNumber
    } = body

    // Validate required fields
    if (!claimId || !inspectorId) {
      return NextResponse.json(
        { error: 'Missing required fields: claimId and inspectorId' },
        { status: 400 }
      )
    }

    // Verify claim exists
    const claimExists = await prisma.claim.findUnique({
      where: { id: claimId }
    })

    if (!claimExists) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    // Verify inspector exists
    const inspectorExists = await prisma.user.findUnique({
      where: { id: inspectorId }
    })

    if (!inspectorExists) {
      return NextResponse.json(
        { error: 'Inspector not found' },
        { status: 404 }
      )
    }

    let inspectionNumber: string

    try {
      // Create inspection number (either provided or auto-generated)
      inspectionNumber = await createInspectionNumber(providedInspectionNumber)
    } catch (error) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 400 }
      )
    }

    const inspection = await prisma.inspection.create({
      data: {
        inspectionNumber,
        inspectionDate: inspectionDate ? new Date(inspectionDate) : new Date(),
        inspectorNotes,
        damageAssessment,
        photos: photos || [],
        claimId,
        inspectorId
      },
      include: {
        inspector: {
          select: { firstName: true, lastName: true, email: true }
        },
        claim: {
          select: { 
            claimNumber: true,
            clientName: true, 
            itemDescription: true 
          }
        }
      }
    })

    return NextResponse.json(inspection, { status: 201 })
  } catch (error) {
    console.error('Error creating inspection:', error)
    return NextResponse.json(
      { error: 'Failed to create inspection' },
      { status: 500 }
    )
  }
}