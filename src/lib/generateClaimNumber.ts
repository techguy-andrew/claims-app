/**
 * Generates a random 8-character alphanumeric claim number
 * Format: uppercase letters and numbers (e.g., "A7B9C2D4", "X3Y8Z1W6")
 */
export function generateClaimNumber(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''

  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}