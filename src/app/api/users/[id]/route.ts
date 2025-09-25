import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for user updates - allow empty names for new claims
const updateUserSchema = z.object({
  name: z.string().optional().default(''),
})

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// PUT /api/users/[id] - Update user name
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate request body
    const validation = updateUserSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { name } = validation.data

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}