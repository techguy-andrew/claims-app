// ============================================================================
// LIBRARY001 VALIDATION UTILITIES
// ============================================================================

/**
 * Validate email address
 */
export function library001ValidateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (US format)
 */
export function library001ValidatePhone(phone: string): boolean {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  return phoneRegex.test(phone)
}

/**
 * Validate required field
 */
export function library001ValidateRequired(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0
}

/**
 * Validate minimum length
 */
export function library001ValidateMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength
}

/**
 * Validate maximum length
 */
export function library001ValidateMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength
}

/**
 * Get validation error message
 */
export function library001GetValidationError(
  field: string,
  validationType: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength',
  params?: { minLength?: number; maxLength?: number }
): string {
  switch (validationType) {
    case 'required':
      return `${field} is required`
    case 'email':
      return `${field} must be a valid email address`
    case 'phone':
      return `${field} must be a valid phone number`
    case 'minLength':
      return `${field} must be at least ${params?.minLength} characters`
    case 'maxLength':
      return `${field} must not exceed ${params?.maxLength} characters`
    default:
      return `${field} is invalid`
  }
}