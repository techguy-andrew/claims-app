import { prisma } from '../src/lib/prisma'
import { generateRandomId } from '../src/lib/random-ids'

async function updateClaimNumbers() {
  console.log('Starting claim number update process...')

  // Get all existing claims
  const claims = await prisma.claim.findMany({
    select: { id: true, claimNumber: true }
  })

  console.log(`Found ${claims.length} claims to potentially update`)

  let updatedCount = 0

  for (const claim of claims) {
    // Check if claim number is already 10 characters
    if (claim.claimNumber.length === 10) {
      console.log(`Claim ${claim.claimNumber} already meets requirements`)
      continue
    }

    // Generate new 10-character claim number
    let newClaimNumber: string
    let attempts = 0
    const maxAttempts = 100

    do {
      newClaimNumber = generateRandomId()
      attempts++

      // Check if this new number already exists
      const existing = await prisma.claim.findFirst({
        where: { 
          claimNumber: newClaimNumber,
          id: { not: claim.id } 
        }
      })

      if (!existing) {
        break
      }
    } while (attempts < maxAttempts)

    if (attempts >= maxAttempts) {
      console.error(`Failed to generate unique claim number for claim ${claim.id}`)
      continue
    }

    // Update the claim
    try {
      await prisma.claim.update({
        where: { id: claim.id },
        data: { claimNumber: newClaimNumber }
      })

      console.log(`Updated claim ${claim.claimNumber} → ${newClaimNumber}`)
      updatedCount++
    } catch (error) {
      console.error(`Failed to update claim ${claim.id}:`, error)
    }
  }

  console.log(`\n✅ Process complete!`)
  console.log(`Updated ${updatedCount} claim numbers`)
  console.log(`${claims.length - updatedCount} claims were already compliant`)
}


updateClaimNumbers()
  .then(() => {
    console.log('Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })