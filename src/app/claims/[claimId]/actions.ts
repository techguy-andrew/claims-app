'use server'

import { prisma } from '@/lib/prisma'
import { ClaimStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function updateClaimStatus(claimId: string, status: ClaimStatus) {
  try {
    await prisma.claim.update({
      where: { id: claimId },
      data: { status },
    })

    // Revalidate the claim details page and claims list
    revalidatePath(`/claims/${claimId}`)
    revalidatePath('/claims')
    revalidatePath('/') // Dashboard page

    return { success: true }
  } catch (error) {
    console.error('Failed to update claim status:', error)
    return { success: false, error: 'Failed to update claim status' }
  }
}