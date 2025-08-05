import { NextRequest, NextResponse } from 'next/server'
import { ClaimStatus } from '@prisma/client'
import { createClaimNumber } from '@/lib/random-ids'
import { prisma } from '@/lib/prisma'

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
      status?: ClaimStatus;
      OR?: Array<{
        claimNumber?: { contains: string; mode: 'insensitive' };
        clientName?: { contains: string; mode: 'insensitive' };
        itemDescription?: { contains: string; mode: 'insensitive' };
      }>;
    }

    const where: ClaimWhere = {}
    
    if (status) {
      where.status = status as ClaimStatus
    }
    
    if (search) {
      where.OR = [
        { claimNumber: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { itemDescription: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [claims, total] = await Promise.all([
      prisma.claim.findMany({
        where,
        skip,
        take: limit,
        orderBy: { claimDate: 'desc' },
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

    const response = NextResponse.json({
      claims,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    
    return response
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
      claimNumber: providedClaimNumber
    } = body

    // Validate required fields
    if (!clientName || !itemDescription || !damageDetails || !organizationId || !createdById) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let claimNumber: string

    try {
      // Create claim number (either provided or auto-generated)
      claimNumber = await createClaimNumber(providedClaimNumber)
    } catch (error) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 400 }
      )
    }

    const claim = await prisma.claim.create({
      data: {
        claimNumber,
        clientName,
        clientEmail,
        clientPhone,
        itemDescription,
        damageDetails,
        incidentDate: incidentDate ? new Date(incidentDate) : null,
        organizationId,
        createdById
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