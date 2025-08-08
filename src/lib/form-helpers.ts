// Phone number formatting
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX
  if (digitsOnly.length >= 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`
  } else if (digitsOnly.length >= 6) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`
  } else if (digitsOnly.length >= 3) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`
  } else {
    return digitsOnly
  }
}

// Clean phone number for API submission (remove formatting)
export const cleanPhoneNumber = (value: string): string => {
  return value.replace(/\D/g, '')
}

// Generate a random claim number - exactly 10 characters (3 letters + 7 numbers)
export const generateClaimNumber = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const prefix = Array.from({ length: 3 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('')
  const suffix = Math.floor(1000000 + Math.random() * 9000000).toString().padStart(7, '0') // 7-digit number
  return `${prefix}${suffix}`
}

// Format status for display
export const formatStatus = (status: string): string => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

// Status options for select dropdown
export const statusOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DENIED', label: 'Denied' },
  { value: 'CLOSED', label: 'Closed' }
]

// Get hardcoded organization and user IDs (since no auth system)
// In a real app, these would come from authentication context
export const getDefaultOrganizationId = (): string => {
  // This should be replaced with actual organization ID from auth context
  return 'cme06ri200000v5bldz8sj8qr' // Hardcoded for now
}

export const getDefaultUserId = (): string => {
  // This should be replaced with actual user ID from auth context
  return 'cme06ri240001v5blb8k3ql4h' // Hardcoded for now
}

// Trim all string values in form data
export const trimFormData = <T extends Record<string, string | unknown>>(data: T): T => {
  const trimmed = { ...data } as Record<string, unknown>
  Object.keys(trimmed).forEach(key => {
    if (typeof trimmed[key] === 'string') {
      trimmed[key] = (trimmed[key] as string).trim()
    }
  })
  return trimmed as T
}