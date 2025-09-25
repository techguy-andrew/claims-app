import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateClaimNumber } from '@/lib/generateClaimNumber'

// POST /api/claims/new - Create a new claim
export async function POST() {
  try {
    // Always create a new blank user for each new claim to ensure completely empty form
    // This gives each new claim its own blank user for proper data isolation
    const blankUser = await prisma.user.create({
      data: {
        clerkId: `new-claim-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
        email: `temp-${Date.now()}@newclaim.local`,
        name: '' // Empty name for completely blank client name field
      }
    })

    // Generate a random 8-character claim number
    const randomClaimNumber = generateClaimNumber()

    // Create a new claim with completely empty fields except for the random claim number
    const newClaim = await prisma.claim.create({
      data: {
        title: '', // Empty title
        claimNumber: randomClaimNumber, // Random 8-character number
        claimantId: blankUser.id,
        status: 'PENDING',
        // All other fields will be null/empty by default
      },
      include: {
        items: {
          orderBy: { createdAt: 'asc' }
        },
        claimant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(newClaim)
  } catch (error) {
    console.error('Error creating new claim:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}