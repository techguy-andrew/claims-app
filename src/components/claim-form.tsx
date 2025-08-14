'use client'

import { useState, useCallback } from 'react'
import { RefreshCw, Wand2, FileText } from 'lucide-react'
import { Input } from '@/components/redesigned/forms/Input'
import { Select } from '@/components/redesigned/forms/Select'
import { Textarea } from '@/components/redesigned/forms/Textarea'
import { Button } from '@/components/redesigned/ui/Button'
import { Label as Field } from '@/components/redesigned/forms/Label'
import { 
  ClaimFormData, 
  ClaimFormErrors, 
  validateClaimForm, 
  hasFormErrors 
} from '@/lib/form-validation'
import {
  formatPhoneNumber,
  cleanPhoneNumber,
  generateClaimNumber,
  statusOptions,
  getDefaultOrganizationId,
  getDefaultUserId
} from '@/lib/form-helpers'

export interface ClaimFormProps {
  initialData?: Partial<ClaimFormData>
  isEditing?: boolean
  onSubmit: (data: ClaimFormData & { organizationId: string; createdById: string }) => Promise<void>
  onCancel: () => void
  loading?: boolean
  submitText?: string
  cancelText?: string
}

export function ClaimForm({
  initialData = {},
  isEditing = false,
  onSubmit,
  onCancel,
  loading = false,
  submitText = 'Create Claim',
  cancelText = 'Cancel'
}: ClaimFormProps) {
  const [formData, setFormData] = useState<ClaimFormData>({
    claimNumber: initialData.claimNumber || generateClaimNumber(),
    insuranceCompany: initialData.insuranceCompany || '',
    adjustorName: initialData.adjustorName || '',
    adjustorEmail: initialData.adjustorEmail || '',
    clientName: initialData.clientName || '',
    clientPhone: initialData.clientPhone || '',
    clientAddress: initialData.clientAddress || '',
    status: initialData.status || 'OPEN'
  })

  const [errors, setErrors] = useState<ClaimFormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Handle form field changes
  const handleChange = useCallback((field: keyof ClaimFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    let value = e.target.value
    
    // Format phone number as user types
    if (field === 'clientPhone') {
      value = formatPhoneNumber(value)
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  // Handle field blur for validation
  const handleBlur = useCallback((field: keyof ClaimFormData) => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    // Validate individual field
    const fieldErrors = validateClaimForm({ ...formData, [field]: formData[field] })
    if (fieldErrors[field]) {
      setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }))
    }
  }, [formData])

  // Generate new claim number
  const handleGenerateClaimNumber = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      claimNumber: generateClaimNumber()
    }))
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate entire form
    const formErrors = validateClaimForm(formData)
    setErrors(formErrors)

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as Record<string, boolean>)
    setTouched(allTouched)

    if (hasFormErrors(formErrors)) {
      return
    }

    try {
      // Clean and prepare data for API
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

  const getFieldError = (field: keyof ClaimFormData) => {
    return touched[field] ? errors[field] : undefined
  }

  return (
    <div className="enterprise-card p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Claim Number */}
        <Field 
          label="Claim Number" 
          required 
          error={getFieldError('claimNumber')}
        >
          <div className="flex gap-2">
            <Input
              type="text"
              value={formData.claimNumber}
              onChange={handleChange('claimNumber')}
              onBlur={handleBlur('claimNumber')}
              placeholder="ABC1234567"
              state={getFieldError('claimNumber') ? 'error' : 'default'}
              className="flex-1"
            />
            <Button
              type="button"
              variant="modern"
              size="small"
              onClick={handleGenerateClaimNumber}
              disabled={loading}
              className="touch-target-lg"
            >
              <Wand2 className="h-4 w-4" />
            </Button>
          </div>
        </Field>

        {/* Insurance Information Section */}
        <div className="border-t border-gray-100/60 pt-8 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="thumbnail-modern p-2.5 flex items-center justify-center">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Insurance Information</h3>
          </div>
          
          <div className="space-y-4">
            <Field 
              label="Insurance Company" 
              error={getFieldError('insuranceCompany')}
            >
              <Input
                type="text"
                value={formData.insuranceCompany}
                onChange={handleChange('insuranceCompany')}
                onBlur={handleBlur('insuranceCompany')}
                placeholder="State Farm, Allstate, etc. (optional)"
                state={getFieldError('insuranceCompany') ? 'error' : 'default'}
              />
            </Field>

            <Field 
              label="Adjustor Name" 
              error={getFieldError('adjustorName')}
            >
              <Input
                type="text"
                value={formData.adjustorName}
                onChange={handleChange('adjustorName')}
                onBlur={handleBlur('adjustorName')}
                placeholder="John Smith (optional)"
                state={getFieldError('adjustorName') ? 'error' : 'default'}
              />
            </Field>

            <Field 
              label="Adjustor Email" 
              error={getFieldError('adjustorEmail')}
            >
              <Input
                type="email"
                value={formData.adjustorEmail}
                onChange={handleChange('adjustorEmail')}
                onBlur={handleBlur('adjustorEmail')}
                placeholder="adjustor@insurance.com (optional)"
                state={getFieldError('adjustorEmail') ? 'error' : 'default'}
              />
            </Field>
          </div>
        </div>

        {/* Client Information Section */}
        <div className="border-t border-gray-100/60 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="thumbnail-modern p-2.5 flex items-center justify-center">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Client Information</h3>
          </div>
          
          <div className="space-y-4">
            <Field 
              label="Client Name" 
              error={getFieldError('clientName')}
            >
              <Input
                type="text"
                value={formData.clientName}
                onChange={handleChange('clientName')}
                onBlur={handleBlur('clientName')}
                placeholder="Jane Doe (optional)"
                state={getFieldError('clientName') ? 'error' : 'default'}
              />
            </Field>

            <Field 
              label="Client Phone" 
              error={getFieldError('clientPhone')}
            >
              <Input
                type="tel"
                value={formData.clientPhone}
                onChange={handleChange('clientPhone')}
                onBlur={handleBlur('clientPhone')}
                placeholder="(555) 123-4567 (optional)"
                state={getFieldError('clientPhone') ? 'error' : 'default'}
              />
            </Field>

            <Field 
              label="Client Address" 
              error={getFieldError('clientAddress')}
            >
              <Textarea
                value={formData.clientAddress}
                onChange={handleChange('clientAddress')}
                onBlur={handleBlur('clientAddress')}
                placeholder="123 Main St, City, State 12345 (optional)"
                state={getFieldError('clientAddress') ? 'error' : 'default'}
                rows={3}
              />
            </Field>
          </div>
        </div>

        {/* Status Section */}
        <div className="border-t border-gray-100/60 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="thumbnail-modern p-2.5 flex items-center justify-center">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Claim Status</h3>
          </div>
          
          <Field label="Status">
            <Select
              value={formData.status}
              onChange={handleChange('status')}
              options={statusOptions}
            />
          </Field>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-8 border-t border-gray-100/60">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1 touch-target-lg"
            size="large"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              submitText
            )}
          </Button>
          
          <Button
            type="button"
            variant="modern"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 touch-target-lg"
            size="large"
          >
            {cancelText}
          </Button>
        </div>
      </form>
    </div>
  )
}