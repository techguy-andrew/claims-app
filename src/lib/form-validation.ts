export interface ValidationResult {
  isValid: boolean
  message?: string
}

export interface ClaimFormData {
  claimNumber: string
  insuranceCompany: string
  adjustorName: string
  adjustorEmail: string
  clientName: string
  clientPhone: string
  clientAddress: string
  status: 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'CLOSED'
}

export interface ClaimFormErrors {
  claimNumber?: string
  insuranceCompany?: string
  adjustorName?: string
  adjustorEmail?: string
  clientName?: string
  clientPhone?: string
  clientAddress?: string
  status?: string
}

// Validation functions
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  const trimmed = value?.trim()
  if (!trimmed) {
    return { isValid: false, message: `${fieldName} is required` }
  }
  return { isValid: true }
}

export const validateEmail = (email: string): ValidationResult => {
  const trimmed = email?.trim()
  // Email is now optional - only validate format if provided
  if (!trimmed) {
    return { isValid: true } // Valid if empty (optional field)
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: 'Please enter a valid email address' }
  }
  
  return { isValid: true }
}

export const validatePhone = (phone: string): ValidationResult => {
  const trimmed = phone?.trim()
  // Phone is now optional - only validate format if provided
  if (!trimmed) {
    return { isValid: true } // Valid if empty (optional field)
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = trimmed.replace(/\D/g, '')
  if (digitsOnly.length < 10) {
    return { isValid: false, message: 'Phone number must be at least 10 digits' }
  }
  
  return { isValid: true }
}

export const validateClaimNumber = (claimNumber: string): ValidationResult => {
  const trimmed = claimNumber?.trim()
  if (!trimmed) {
    return { isValid: false, message: 'Claim number is required' }
  }
  
  // Remove hyphens and convert to uppercase for validation
  const cleaned = trimmed.replace(/-/g, '').toUpperCase()
  
  // Claim number must be exactly 10 characters long and contain only uppercase letters and numbers
  if (cleaned.length !== 10) {
    return { isValid: false, message: 'ID must be exactly 10 characters long and contain only uppercase letters and numbers' }
  }
  
  const claimRegex = /^[A-Z0-9]{10}$/
  if (!claimRegex.test(cleaned)) {
    return { isValid: false, message: 'ID must be exactly 10 characters long and contain only uppercase letters and numbers' }
  }
  
  return { isValid: true }
}

// Comprehensive form validation - only claim number is required
export const validateClaimForm = (data: ClaimFormData): ClaimFormErrors => {
  const errors: ClaimFormErrors = {}
  
  // Claim number is required
  const claimNumberResult = validateClaimNumber(data.claimNumber)
  if (!claimNumberResult.isValid) {
    errors.claimNumber = claimNumberResult.message
  }
  
  // All other fields are optional, but validate format if provided
  
  // Optional email format validation
  const adjustorEmailResult = validateEmail(data.adjustorEmail)
  if (!adjustorEmailResult.isValid) {
    errors.adjustorEmail = adjustorEmailResult.message
  }
  
  // Optional phone format validation
  const clientPhoneResult = validatePhone(data.clientPhone)
  if (!clientPhoneResult.isValid) {
    errors.clientPhone = clientPhoneResult.message
  }
  
  // Note: Insurance company, adjustor name, client name, and client address
  // are now optional and don't need validation
  
  return errors
}

// Check if form has any errors
export const hasFormErrors = (errors: ClaimFormErrors): boolean => {
  return Object.keys(errors).length > 0
}