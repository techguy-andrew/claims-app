import { prisma } from './prisma'

export type EntityType = 'CLAIM'

/**
 * Generates a random 10-character alphanumeric ID
 * Format: uppercase letters and numbers, e.g., "FUR2K8X9M3"
 */
export function generateRandomId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * Generates a unique random ID for the specified entity type
 * Keeps trying until a unique ID is found
 */
export async function generateUniqueId(entityType: EntityType): Promise<string> {
  let attempts = 0
  const maxAttempts = 100 // Prevent infinite loops
  
  while (attempts < maxAttempts) {
    const id = generateRandomId()
    const isUnique = await isIdUnique(entityType, id)
    
    if (isUnique) {
      return id
    }
    
    attempts++
  }
  
  throw new Error(`Failed to generate unique ${entityType} ID after ${maxAttempts} attempts`)
}

/**
 * Checks if an ID is unique for the specified entity type
 */
export async function isIdUnique(entityType: EntityType, id: string, excludeRecordId?: string): Promise<boolean> {
  if (entityType === 'CLAIM') {
    const existing = await prisma.claim.findFirst({
      where: {
        claimNumber: id,
        ...(excludeRecordId && { id: { not: excludeRecordId } })
      }
    })
    return !existing
  }
  
  return false
}

/**
 * Validates a user-provided ID format and uniqueness
 */
export async function validateId(
  entityType: EntityType, 
  id: string, 
  excludeRecordId?: string
): Promise<{ isValid: boolean; message?: string }> {
  // Check format: 10 characters, alphanumeric, uppercase
  const formatRegex = /^[A-Z0-9]{10}$/
  
  if (!formatRegex.test(id)) {
    return {
      isValid: false,
      message: 'ID must be exactly 10 characters long and contain only uppercase letters and numbers'
    }
  }
  
  // Check uniqueness
  const isUnique = await isIdUnique(entityType, id, excludeRecordId)
  
  if (!isUnique) {
    return {
      isValid: false,
      message: `Claim number ${id} is already in use`
    }
  }
  
  return { isValid: true }
}

/**
 * Creates a claim number (either user-provided or auto-generated)
 */
export async function createClaimNumber(userProvidedId?: string): Promise<string> {
  if (userProvidedId) {
    // Validate user-provided ID
    const validation = await validateId('CLAIM', userProvidedId.toUpperCase())
    if (!validation.isValid) {
      throw new Error(validation.message)
    }
    return userProvidedId.toUpperCase()
  } else {
    // Generate unique ID
    return await generateUniqueId('CLAIM')
  }
}


/**
 * Formats an ID for display purposes
 */
export function formatId(id: string): string {
  return id.toUpperCase()
}

/**
 * Validates ID format without checking database uniqueness
 */
export function isValidIdFormat(id: string): boolean {
  const formatRegex = /^[A-Z0-9]{10}$/
  return formatRegex.test(id.toUpperCase())
}