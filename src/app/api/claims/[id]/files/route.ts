import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/claims/[id]/files - List all files for a claim
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const unassignedOnly = searchParams.get('unassigned') === 'true'

    const files = await prisma.claimFile.findMany({
      where: { 
        claimId: id,
        ...(unassignedOnly && { itemId: null })
      },
      include: {
        item: {
          select: { id: true, itemName: true }
        }
      },
      orderBy: { uploadedAt: 'desc' }
    })

    return NextResponse.json({ files })
  } catch (error) {
    console.error('Error fetching claim files:', error)
    return NextResponse.json(
      { error: 'Failed to fetch claim files' },
      { status: 500 }
    )
  }
}

// POST /api/claims/[id]/files - Upload file to claim
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { 
      fileName, 
      fileUrl, 
      fileType, 
      fileSize, 
      mimeType, 
      itemId 
    } = body

    // Validate required fields
    if (!fileName || !fileUrl || !fileType) {
      return NextResponse.json(
        { error: 'Missing required fields: fileName, fileUrl, fileType' },
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

    // If itemId is provided, verify it belongs to this claim
    if (itemId) {
      const item = await prisma.claimItem.findFirst({
        where: { 
          id: itemId,
          claimId: id 
        }
      })

      if (!item) {
        return NextResponse.json(
          { error: 'Item not found or does not belong to this claim' },
          { status: 400 }
        )
      }
    }

    const file = await prisma.claimFile.create({
      data: {
        claimId: id,
        itemId: itemId || null,
        fileName: fileName.trim(),
        fileUrl: fileUrl.trim(),
        fileType: fileType.trim(),
        fileSize: fileSize || null,
        mimeType: mimeType || null
      },
      include: {
        item: {
          select: { id: true, itemName: true }
        }
      }
    })

    return NextResponse.json(file, { status: 201 })
  } catch (error) {
    console.error('Error creating claim file:', error)
    return NextResponse.json(
      { error: 'Failed to create claim file' },
      { status: 500 }
    )
  }
}