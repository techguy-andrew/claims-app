import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getNextSequentialNumber, validateSequentialNumber, reserveSequentialNumber } from '@/lib/sequential-numbers'

const prisma = new PrismaClient()

// GET /api/claims - List all claims
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    interface ClaimWhere {
      status?: string;
      OR?: Array<{
        claimNumber?: { contains: string; mode: 'insensitive' };
        clientName?: { contains: string; mode: 'insensitive' };
        itemDescription?: { contains: string; mode: 'insensitive' };
        sequentialNumber?: number;
      }>;
    }

    const where: ClaimWhere = {}
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { claimNumber: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { itemDescription: { contains: search, mode: 'insensitive' } },
        // Allow searching by sequential number
        ...(isNaN(parseInt(search)) ? [] : [{ sequentialNumber: parseInt(search) }])
      ]
    }

    const [claims, total] = await Promise.all([
      prisma.claim.findMany({
        where,
        skip,
        take: limit,
        orderBy: { sequentialNumber: 'desc' },
        include: {
          createdBy: {
            select: { firstName: true, lastName: true, email: true }
          },
          organization: {
            select: { name: true }
          },
          inspections: {
            select: { id: true, inspectionDate: true }
          }
        }
      }),
      prisma.claim.count({ where })
    ])

    return NextResponse.json({
      claims,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching claims:', error)
    return NextResponse.json(
      { error: 'Failed to fetch claims' },
      { status: 500 }
    )
  }
}

// POST /api/claims - Create new claim
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      clientName,
      clientEmail,
      clientPhone,
      itemDescription,
      damageDetails,
      incidentDate,
      organizationId,
      createdById,
      sequentialNumber: providedSequentialNumber
    } = body

    // Validate required fields
    if (!clientName || !itemDescription || !damageDetails || !organizationId || !createdById) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let sequentialNumber: number

    if (providedSequentialNumber) {
      // Validate manually provided sequential number
      const validation = await validateSequentialNumber('CLAIM', providedSequentialNumber)
      if (!validation.isValid) {
        return NextResponse.json(
          { error: validation.message },
          { status: 400 }
        )
      }
      sequentialNumber = providedSequentialNumber
      // Reserve this number to prevent conflicts
      await reserveSequentialNumber('CLAIM', sequentialNumber)
    } else {
      // Auto-generate sequential number
      sequentialNumber = await getNextSequentialNumber('CLAIM')
    }

    const claim = await prisma.claim.create({
      data: {
        clientName,
        clientEmail,
        clientPhone,
        itemDescription,
        damageDetails,
        incidentDate: incidentDate ? new Date(incidentDate) : null,
        organizationId,
        createdById,
        sequentialNumber
      },
      include: {
        createdBy: {
          select: { firstName: true, lastName: true, email: true }
        },
        organization: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json(claim, { status: 201 })
  } catch (error) {
    console.error('Error creating claim:', error)
    return NextResponse.json(
      { error: 'Failed to create claim' },
      { status: 500 }
    )
  }
}