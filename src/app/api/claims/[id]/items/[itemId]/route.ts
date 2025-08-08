import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/claims/[id]/items/[itemId] - Get single item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id, itemId } = await params

    const item = await prisma.claimItem.findFirst({
      where: { 
        id: itemId,
        claimId: id 
      },
      include: {
        files: {
          orderBy: { uploadedAt: 'desc' }
        }
      }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching claim item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch claim item' },
      { status: 500 }
    )
  }
}

// PUT /api/claims/[id]/items/[itemId] - Update item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id, itemId } = await params
    const body = await request.json()
    
    const { itemName, details } = body

    // Validate required fields
    if (!itemName?.trim()) {
      return NextResponse.json(
        { error: 'Item name is required' },
        { status: 400 }
      )
    }

    // Check if item exists and belongs to this claim
    const existingItem = await prisma.claimItem.findFirst({
      where: { 
        id: itemId,
        claimId: id 
      }
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    const item = await prisma.claimItem.update({
      where: { id: itemId },
      data: {
        itemName: itemName.trim(),
        details: details?.trim() || null
      },
      include: {
        files: {
          orderBy: { uploadedAt: 'desc' }
        }
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating claim item:', error)
    return NextResponse.json(
      { error: 'Failed to update claim item' },
      { status: 500 }
    )
  }
}

// DELETE /api/claims/[id]/items/[itemId] - Delete item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id, itemId } = await params

    // Check if item exists and belongs to this claim
    const existingItem = await prisma.claimItem.findFirst({
      where: { 
        id: itemId,
        claimId: id 
      }
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    // Delete the item (files will be set to null due to onDelete: SetNull)
    await prisma.claimItem.delete({
      where: { id: itemId }
    })

    return NextResponse.json(
      { message: 'Item deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting claim item:', error)
    return NextResponse.json(
      { error: 'Failed to delete claim item' },
      { status: 500 }
    )
  }
}