import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/claims/[id]/files/[fileId] - Get single file
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const { id, fileId } = await params

    const file = await prisma.claimFile.findFirst({
      where: { 
        id: fileId,
        claimId: id 
      },
      include: {
        item: {
          select: { id: true, itemName: true }
        }
      }
    })

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(file)
  } catch (error) {
    console.error('Error fetching claim file:', error)
    return NextResponse.json(
      { error: 'Failed to fetch claim file' },
      { status: 500 }
    )
  }
}

// PUT /api/claims/[id]/files/[fileId] - Update file (mainly for item assignment)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const { id, fileId } = await params
    const body = await request.json()
    
    const { itemId, fileName } = body

    // Check if file exists and belongs to this claim
    const existingFile = await prisma.claimFile.findFirst({
      where: { 
        id: fileId,
        claimId: id 
      }
    })

    if (!existingFile) {
      return NextResponse.json(
        { error: 'File not found' },
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

    const updateData: { itemId?: string | null; fileName?: string } = {}
    
    // Handle item assignment/unassignment
    if (itemId !== undefined) {
      updateData.itemId = itemId || null
    }
    
    // Handle file renaming
    if (fileName) {
      updateData.fileName = fileName.trim()
    }

    const file = await prisma.claimFile.update({
      where: { id: fileId },
      data: updateData,
      include: {
        item: {
          select: { id: true, itemName: true }
        }
      }
    })

    return NextResponse.json(file)
  } catch (error) {
    console.error('Error updating claim file:', error)
    return NextResponse.json(
      { error: 'Failed to update claim file' },
      { status: 500 }
    )
  }
}

// DELETE /api/claims/[id]/files/[fileId] - Delete file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const { id, fileId } = await params

    // Check if file exists and belongs to this claim
    const existingFile = await prisma.claimFile.findFirst({
      where: { 
        id: fileId,
        claimId: id 
      }
    })

    if (!existingFile) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Delete the file record
    await prisma.claimFile.delete({
      where: { id: fileId }
    })

    // Note: In a production app, you might also want to delete the actual file from Cloudinary
    // For now, we just delete the database record

    return NextResponse.json(
      { message: 'File deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting claim file:', error)
    return NextResponse.json(
      { error: 'Failed to delete claim file' },
      { status: 500 }
    )
  }
}