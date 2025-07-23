import { prisma } from './prisma'

export type EntityType = 'CLAIM' | 'INSPECTION'

/**
 * Gets the next sequential number for a given entity type
 * This function handles concurrent access by using database transactions
 */
export async function getNextSequentialNumber(entityType: EntityType): Promise<number> {
  return await prisma.$transaction(async (tx) => {
    // Try to find existing counter
    let counter = await tx.numberCounter.findUnique({
      where: { entityType }
    })

    if (!counter) {
      // Create new counter if it doesn't exist
      counter = await tx.numberCounter.create({
        data: {
          entityType,
          currentValue: 1
        }
      })
      return 1
    }

    // Increment and update counter
    const nextValue = counter.currentValue + 1
    await tx.numberCounter.update({
      where: { entityType },
      data: { currentValue: nextValue }
    })

    return nextValue
  })
}

/**
 * Validates if a sequential number is available for use
 * Returns true if the number can be used, false otherwise
 */
export async function validateSequentialNumber(
  entityType: EntityType,
  sequentialNumber: number,
  excludeId?: string
): Promise<{ isValid: boolean; message?: string }> {
  if (sequentialNumber < 1) {
    return { isValid: false, message: 'Sequential number must be greater than 0' }
  }

  // Check if number is already in use
  const existingRecord = entityType === 'CLAIM' 
    ? await prisma.claim.findFirst({
        where: { 
          sequentialNumber,
          ...(excludeId && { id: { not: excludeId } })
        }
      })
    : await prisma.inspection.findFirst({
        where: { 
          sequentialNumber,
          ...(excludeId && { id: { not: excludeId } })
        }
      })

  if (existingRecord) {
    return { 
      isValid: false, 
      message: `${entityType === 'CLAIM' ? 'Claim' : 'Inspection'} #${sequentialNumber} already exists` 
    }
  }

  return { isValid: true }
}

/**
 * Reserves a sequential number by updating the counter if necessary
 * This ensures that auto-generated numbers don't conflict with manually set ones
 */
export async function reserveSequentialNumber(
  entityType: EntityType, 
  sequentialNumber: number
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const counter = await tx.numberCounter.findUnique({
      where: { entityType }
    })

    if (!counter) {
      // Create counter with the reserved number
      await tx.numberCounter.create({
        data: {
          entityType,
          currentValue: sequentialNumber
        }
      })
    } else if (counter.currentValue < sequentialNumber) {
      // Update counter to ensure future auto-generated numbers don't conflict
      await tx.numberCounter.update({
        where: { entityType },
        data: { currentValue: sequentialNumber }
      })
    }
  })
}

/**
 * Initializes counters based on existing data in the database
 * Useful for migrating existing systems
 */
export async function initializeCounters(): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Initialize claim counter
    const maxClaimNumber = await tx.claim.findFirst({
      orderBy: { sequentialNumber: 'desc' },
      select: { sequentialNumber: true }
    })

    const claimCounter = await tx.numberCounter.findUnique({
      where: { entityType: 'CLAIM' }
    })

    if (!claimCounter) {
      await tx.numberCounter.create({
        data: {
          entityType: 'CLAIM',
          currentValue: maxClaimNumber?.sequentialNumber ?? 0
        }
      })
    }

    // Initialize inspection counter
    const maxInspectionNumber = await tx.inspection.findFirst({
      orderBy: { sequentialNumber: 'desc' },
      select: { sequentialNumber: true }
    })

    const inspectionCounter = await tx.numberCounter.findUnique({
      where: { entityType: 'INSPECTION' }
    })

    if (!inspectionCounter) {
      await tx.numberCounter.create({
        data: {
          entityType: 'INSPECTION',
          currentValue: maxInspectionNumber?.sequentialNumber ?? 0
        }
      })
    }
  })
}

/**
 * Backfills sequential numbers for existing records that don't have them
 * Note: This is only needed during migration when fields were optional
 */
export async function backfillSequentialNumbers(): Promise<void> {
  console.log('Backfill not needed - all records should have sequential numbers')
}