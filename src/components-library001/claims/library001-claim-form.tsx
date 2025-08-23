'use client'

import { useState, useCallback } from 'react'
import { RefreshCw, Wand2, FileText } from 'lucide-react'
import { Library001Input } from '../ui/library001-input'
import { Library001Select } from '../ui/library001-select'
import { Library001Textarea } from '../ui/library001-textarea'
import { Library001Button } from '../ui/library001-button'
import { Library001Label } from '../ui/library001-label'
import { Library001Card } from '../ui/library001-card'

// ============================================================================
// TYPES
// ============================================================================

export interface Library001ClaimFormData {
  claimNumber: string
  insuranceCompany: string
  adjustorName: string
  adjustorEmail: string
  clientName: string
  clientPhone: string
  clientAddress: string
  status: 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'CLOSED'
}

export interface Library001ClaimFormErrors {
  claimNumber?: string
  insuranceCompany?: string
  adjustorName?: string
  adjustorEmail?: string
  clientName?: string
  clientPhone?: string
  clientAddress?: string
  status?: string
}

export interface Library001ClaimFormProps {
  initialData?: Partial<Library001ClaimFormData>
  isEditing?: boolean
  onSubmit: (data: Library001ClaimFormData & { organizationId: string; createdById: string }) => Promise<void>
  onCancel: () => void
  loading?: boolean
  submitText?: string
  cancelText?: string
}

// ============================================================================
// HELPERS
// ============================================================================

const formatPhoneNumber = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '')
  if (digitsOnly.length >= 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`
  } else if (digitsOnly.length >= 6) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`
  } else if (digitsOnly.length >= 3) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`
  }
  return digitsOnly
}

const cleanPhoneNumber = (value: string): string => {
  return value.replace(/\D/g, '')
}

const generateClaimNumber = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const prefix = Array.from({ length: 3 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('')
  const suffix = Math.floor(1000000 + Math.random() * 9000000).toString().padStart(7, '0')
  return `${prefix}${suffix}`
}

const statusOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DENIED', label: 'Denied' },
  { value: 'CLOSED', label: 'Closed' }
]

// Temporary hardcoded IDs - should come from auth context in production
const getDefaultOrganizationId = (): string => 'cme06ri200000v5bldz8sj8qr'
const getDefaultUserId = (): string => 'cme06ri240001v5blb8k3ql4h'

// ============================================================================
// VALIDATION
// ============================================================================

const validateClaimNumber = (claimNumber: string): { isValid: boolean; message?: string } => {
  const trimmed = claimNumber?.trim()
  if (!trimmed) {
    return { isValid: false, message: 'Claim number is required' }
  }
  
  const cleaned = trimmed.replace(/-/g, '').toUpperCase()
  if (cleaned.length !== 10) {
    return { isValid: false, message: 'ID must be exactly 10 characters long' }
  }
  
  const claimRegex = /^[A-Z0-9]{10}$/
  if (!claimRegex.test(cleaned)) {
    return { isValid: false, message: 'ID must contain only letters and numbers' }
  }
  
  return { isValid: true }
}

const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  const trimmed = email?.trim()
  if (!trimmed) return { isValid: true } // Optional field
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: 'Please enter a valid email address' }
  }
  
  return { isValid: true }
}

const validatePhone = (phone: string): { isValid: boolean; message?: string } => {
  const trimmed = phone?.trim()
  if (!trimmed) return { isValid: true } // Optional field
  
  const digitsOnly = trimmed.replace(/\D/g, '')
  if (digitsOnly.length < 10) {
    return { isValid: false, message: 'Phone number must be at least 10 digits' }
  }
  
  return { isValid: true }
}

const validateClaimForm = (data: Library001ClaimFormData): Library001ClaimFormErrors => {
  const errors: Library001ClaimFormErrors = {}
  
  const claimNumberResult = validateClaimNumber(data.claimNumber)
  if (!claimNumberResult.isValid) {
    errors.claimNumber = claimNumberResult.message
  }
  
  const adjustorEmailResult = validateEmail(data.adjustorEmail)
  if (!adjustorEmailResult.isValid) {
    errors.adjustorEmail = adjustorEmailResult.message
  }
  
  const clientPhoneResult = validatePhone(data.clientPhone)
  if (!clientPhoneResult.isValid) {
    errors.clientPhone = clientPhoneResult.message
  }
  
  return errors
}

const hasFormErrors = (errors: Library001ClaimFormErrors): boolean => {
  return Object.keys(errors).length > 0
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Library001ClaimForm({
  initialData = {},
  isEditing = false,
  onSubmit,
  onCancel,
  loading = false,
  submitText = 'Create Claim',
  cancelText = 'Cancel'
}: Library001ClaimFormProps) {
  const [formData, setFormData] = useState<Library001ClaimFormData>({
    claimNumber: initialData.claimNumber || generateClaimNumber(),
    insuranceCompany: initialData.insuranceCompany || '',
    adjustorName: initialData.adjustorName || '',
    adjustorEmail: initialData.adjustorEmail || '',
    clientName: initialData.clientName || '',
    clientPhone: initialData.clientPhone || '',
    clientAddress: initialData.clientAddress || '',
    status: initialData.status || 'OPEN'
  })

  const [errors, setErrors] = useState<Library001ClaimFormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = useCallback((field: keyof Library001ClaimFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    let value = e.target.value
    
    if (field === 'clientPhone') {
      value = formatPhoneNumber(value)
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  const handleBlur = useCallback((field: keyof Library001ClaimFormData) => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    const fieldErrors = validateClaimForm({ ...formData, [field]: formData[field] })
    if (fieldErrors[field]) {
      setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }))
    }
  }, [formData])

  const handleGenerateClaimNumber = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      claimNumber: generateClaimNumber()
    }))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formErrors = validateClaimForm(formData)
    setErrors(formErrors)

    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as Record<string, boolean>)
    setTouched(allTouched)

    if (hasFormErrors(formErrors)) {
      return
    }

    try {
      const cleanedData = {
        claimNumber: formData.claimNumber.trim().replace(/-/g, '').toUpperCase(),
        insuranceCompany: formData.insuranceCompany.trim() || '',
        adjustorName: formData.adjustorName.trim() || '',
        adjustorEmail: formData.adjustorEmail.trim() || '',
        clientName: formData.clientName.trim() || '',
        clientPhone: formData.clientPhone ? cleanPhoneNumber(formData.clientPhone) : '',
        clientAddress: formData.clientAddress.trim() || '',
        status: formData.status,
        organizationId: getDefaultOrganizationId(),
        createdById: getDefaultUserId()
      }
      
      await onSubmit(cleanedData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }, [formData, onSubmit])

  const getFieldError = (field: keyof Library001ClaimFormData) => {
    return touched[field] ? errors[field] : undefined
  }

  return (
    <Library001Card variant="enterprise" padding="lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Claim Number */}
        <div className="space-y-2">
          <Library001Label htmlFor="claimNumber" required>
            Claim Number
          </Library001Label>
          <div className="flex gap-2">
            <Library001Input
              id="claimNumber"
              type="text"
              value={formData.claimNumber}
              onChange={handleChange('claimNumber')}
              onBlur={handleBlur('claimNumber')}
              placeholder="ABC1234567"
              error={getFieldError('claimNumber')}
              className="flex-1"
            />
            <Library001Button
              type="button"
              variant="modern"
              size="default"
              onClick={handleGenerateClaimNumber}
              disabled={loading}
            >
              <Wand2 className="h-4 w-4" />
            </Library001Button>
          </div>
        </div>

        {/* Insurance Information Section */}
        <div className="border-t border-gray-100/60 pt-8 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Insurance Information</h3>
          </div>
          
          <div className="space-y-4">
            <Library001Input
              id="insuranceCompany"
              label="Insurance Company"
              value={formData.insuranceCompany}
              onChange={handleChange('insuranceCompany')}
              onBlur={handleBlur('insuranceCompany')}
              placeholder="State Farm, Allstate, etc. (optional)"
              error={getFieldError('insuranceCompany')}
            />

            <Library001Input
              id="adjustorName"
              label="Adjustor Name"
              value={formData.adjustorName}
              onChange={handleChange('adjustorName')}
              onBlur={handleBlur('adjustorName')}
              placeholder="John Smith (optional)"
              error={getFieldError('adjustorName')}
            />

            <Library001Input
              id="adjustorEmail"
              label="Adjustor Email"
              type="email"
              value={formData.adjustorEmail}
              onChange={handleChange('adjustorEmail')}
              onBlur={handleBlur('adjustorEmail')}
              placeholder="adjustor@insurance.com (optional)"
              error={getFieldError('adjustorEmail')}
            />
          </div>
        </div>

        {/* Client Information Section */}
        <div className="border-t border-gray-100/60 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Client Information</h3>
          </div>
          
          <div className="space-y-4">
            <Library001Input
              id="clientName"
              label="Client Name"
              value={formData.clientName}
              onChange={handleChange('clientName')}
              onBlur={handleBlur('clientName')}
              placeholder="Jane Doe (optional)"
              error={getFieldError('clientName')}
            />

            <Library001Input
              id="clientPhone"
              label="Client Phone"
              type="tel"
              value={formData.clientPhone}
              onChange={handleChange('clientPhone')}
              onBlur={handleBlur('clientPhone')}
              placeholder="(555) 123-4567 (optional)"
              error={getFieldError('clientPhone')}
            />

            <Library001Textarea
              id="clientAddress"
              label="Client Address"
              value={formData.clientAddress}
              onChange={handleChange('clientAddress')}
              onBlur={handleBlur('clientAddress')}
              placeholder="123 Main St, City, State 12345 (optional)"
              error={getFieldError('clientAddress')}
              rows={3}
            />
          </div>
        </div>

        {/* Status Section */}
        <div className="border-t border-gray-100/60 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Claim Status</h3>
          </div>
          
          <Library001Select
            id="status"
            label="Status"
            value={formData.status}
            onChange={handleChange('status')}
            options={statusOptions}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-8 border-t border-gray-100/60">
          <Library001Button
            type="submit"
            variant="primary"
            loading={loading}
            fullWidth
            size="lg"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              submitText
            )}
          </Library001Button>
          
          <Library001Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            fullWidth
            size="lg"
          >
            {cancelText}
          </Library001Button>
        </div>
      </form>
    </Library001Card>
  )
}

export default Library001ClaimForm