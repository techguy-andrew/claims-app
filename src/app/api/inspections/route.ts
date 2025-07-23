import { NextRequest, NextResponse } from 'next/server'
import { getNextSequentialNumber, validateSequentialNumber, reserveSequentialNumber } from '@/lib/sequential-numbers'
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
        orderBy: { sequentialNumber: 'desc' },
        include: {
          inspector: {
            select: { firstName: true, lastName: true, email: true }
          },
          claim: {
            select: { 
              claimNumber: true, 
              sequentialNumber: true,
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
      sequentialNumber: providedSequentialNumber
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

    let sequentialNumber: number

    if (providedSequentialNumber) {
      // Validate manually provided sequential number
      const validation = await validateSequentialNumber('INSPECTION', providedSequentialNumber)
      if (!validation.isValid) {
        return NextResponse.json(
          { error: validation.message },
          { status: 400 }
        )
      }
      sequentialNumber = providedSequentialNumber
      // Reserve this number to prevent conflicts
      await reserveSequentialNumber('INSPECTION', sequentialNumber)
    } else {
      // Auto-generate sequential number
      sequentialNumber = await getNextSequentialNumber('INSPECTION')
    }

    const inspection = await prisma.inspection.create({
      data: {
        inspectionDate: inspectionDate ? new Date(inspectionDate) : new Date(),
        inspectorNotes,
        damageAssessment,
        photos: photos || [],
        claimId,
        inspectorId,
        sequentialNumber
      },
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

    return NextResponse.json(inspection, { status: 201 })
  } catch (error) {
    console.error('Error creating inspection:', error)
    return NextResponse.json(
      { error: 'Failed to create inspection' },
      { status: 500 }
    )
  }
}