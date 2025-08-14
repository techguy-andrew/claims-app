'use client'

import React, { useCallback, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Save, 
  X, 
  RefreshCw, 
  Wand2, 
  FileText,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Input } from '../forms/Input'
import { Textarea } from '../forms/Textarea'
import { Select } from '../forms/Select'
import { Field } from '../forms/Label'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import styles from './ClaimForm.module.css'

// ============================================================================
// ZOD SCHEMA - Single source of truth for validation
// ============================================================================

export const claimFormSchema = z.object({
  claimNumber: z.string()
    .min(1, 'Claim number is required')
    .max(50, 'Claim number must be less than 50 characters')
    .regex(/^[A-Z0-9-]+$/, 'Claim number can only contain uppercase letters, numbers, and hyphens'),
  
  insuranceCompany: z.string()
    .min(1, 'Insurance company is required')
    .max(100, 'Insurance company name must be less than 100 characters'),
  
  adjustorName: z.string()
    .min(1, 'Adjustor name is required')
    .max(100, 'Adjustor name must be less than 100 characters'),
  
  adjustorEmail: z.string()
    .min(1, 'Adjustor email is required')
    .email('Please enter a valid email address'),
  
  clientName: z.string()
    .min(1, 'Client name is required')
    .max(100, 'Client name must be less than 100 characters'),
  
  clientPhone: z.string()
    .min(1, 'Client phone is required')
    .regex(/^[\d\s\-\(\)\+\.]+$/, 'Please enter a valid phone number'),
  
  clientAddress: z.string()
    .min(1, 'Client address is required')
    .max(500, 'Address must be less than 500 characters'),
  
  status: z.enum(['OPEN', 'IN_PROGRESS', 'UNDER_REVIEW', 'APPROVED', 'DENIED', 'CLOSED'], {
    required_error: 'Please select a status'
  }),
  
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),
  
  estimatedAmount: z.number()
    .min(0, 'Amount must be positive')
    .max(10000000, 'Amount must be less than $10,000,000')
    .optional()
})

export type ClaimFormData = z.infer<typeof claimFormSchema>

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ClaimFormProps {
  initialData?: Partial<ClaimFormData>
  isEditing?: boolean
  onSubmit: (data: ClaimFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  submitText?: string
  cancelText?: string
  showHeader?: boolean
  compact?: boolean
  className?: string
}

// ============================================================================
// CONSTANTS
// ============================================================================

const statusOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DENIED', label: 'Denied' },
  { value: 'CLOSED', label: 'Closed' }
] as const

const insuranceCompanies = [
  'State Farm',
  'Allstate',
  'Progressive',
  'GEICO',
  'Liberty Mutual',
  'Farmers',
  'USAA',
  'American Family',
  'Nationwide',
  'Travelers',
  'Other'
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateClaimNumber = (): string => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `CLM-${year}-${random}`
}

const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return value
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

// ============================================================================
// FORM SECTION COMPONENT
// ============================================================================

const FormSection: React.FC<{
  title: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  className?: string
}> = ({ title, description, icon: Icon, children, className }) => {
  return (
    <motion.div
      className={`${styles.formSection} ${className || ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>
          <Icon className={styles.sectionIconSvg} />
        </div>
        <div className={styles.sectionContent}>
          <h3 className={styles.sectionTitle}>{title}</h3>
          {description && (
            <p className={styles.sectionDescription}>{description}</p>
          )}
        </div>
      </div>
      <div className={styles.sectionFields}>
        {children}
      </div>
    </motion.div>
  )
}

// ============================================================================
// MAIN CLAIM FORM COMPONENT
// ============================================================================

export const ClaimForm: React.FC<ClaimFormProps> = ({
  initialData = {},
  isEditing = false,
  onSubmit,
  onCancel,
  loading = false,
  submitText,
  cancelText = 'Cancel',
  showHeader = true,
  compact = false,
  className
}) => {
  // Default submit text based on editing state
  const defaultSubmitText = isEditing ? 'Update Claim' : 'Create Claim'
  
  // Form setup with React Hook Form + Zod
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
    reset
  } = useForm<ClaimFormData>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      claimNumber: initialData.claimNumber || generateClaimNumber(),
      insuranceCompany: initialData.insuranceCompany || '',
      adjustorName: initialData.adjustorName || '',
      adjustorEmail: initialData.adjustorEmail || '',
      clientName: initialData.clientName || '',
      clientPhone: initialData.clientPhone || '',
      clientAddress: initialData.clientAddress || '',
      status: initialData.status || 'OPEN',
      description: initialData.description || '',
      estimatedAmount: initialData.estimatedAmount
    },
    mode: 'onChange'
  })

  // Watch form values for dynamic updates
  const watchedValues = watch()

  // Submit handler
  const handleFormSubmit = useCallback(async (data: ClaimFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }, [onSubmit])

  // Generate new claim number
  const handleGenerateClaimNumber = useCallback(() => {
    setValue('claimNumber', generateClaimNumber(), { shouldValidate: true })
  }, [setValue])

  // Auto-format phone number
  const handlePhoneChange = useCallback((value: string) => {
    const formatted = formatPhoneNumber(value)
    setValue('clientPhone', formatted, { shouldValidate: true })
  }, [setValue])

  // Form classes
  const formClasses = [
    styles.claimForm,
    compact && styles.compact,
    className
  ].filter(Boolean).join(' ')

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      className={formClasses}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      {showHeader && (
        <div className={styles.formHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <FileText className={styles.headerIconSvg} />
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.headerTitle}>
                {isEditing ? 'Edit Claim' : 'Create New Claim'}
              </h2>
              <p className={styles.headerDescription}>
                {isEditing 
                  ? 'Update claim information and details'
                  : 'Enter claim information to create a new insurance claim'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
        {/* Claim Information Section */}
        <FormSection
          title="Claim Information"
          description="Basic claim details and identification"
          icon={FileText}
        >
          <div className={styles.fieldGrid}>
            <Field
              label="Claim Number"
              required
              error={errors.claimNumber?.message}
              className={styles.fieldContainer}
            >
              <div className={styles.claimNumberField}>
                <Controller
                  name="claimNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="CLM-2024-0001"
                      state={errors.claimNumber ? 'error' : 'default'}
                      disabled={isEditing}
                      leftIcon={<FileText />}
                    />
                  )}
                />
                {!isEditing && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="default"
                    onClick={handleGenerateClaimNumber}
                    leftIcon={<RefreshCw />}
                    className={styles.generateButton}
                    title="Generate new claim number"
                  />
                )}
              </div>
            </Field>

            <Field
              label="Status"
              required
              error={errors.status?.message}
              className={styles.fieldContainer}
            >
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={statusOptions}
                    placeholder="Select status"
                    state={errors.status ? 'error' : 'default'}
                  />
                )}
              />
            </Field>
          </div>

          <Field
            label="Description"
            error={errors.description?.message}
            className={styles.fieldContainer}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Brief description of the claim..."
                  rows={3}
                  state={errors.description ? 'error' : 'default'}
                  autoResize
                />
              )}
            />
          </Field>

          <Field
            label="Estimated Amount"
            error={errors.estimatedAmount?.message}
            className={styles.fieldContainer}
          >
            <Controller
              name="estimatedAmount"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="0.00"
                  value={value?.toString() || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    onChange(val ? parseFloat(val) : undefined)
                  }}
                  state={errors.estimatedAmount ? 'error' : 'default'}
                  leftIcon={<span className={styles.dollarSign}>$</span>}
                />
              )}
            />
          </Field>
        </FormSection>

        {/* Insurance Information Section */}
        <FormSection
          title="Insurance Information"
          description="Insurance company and adjustor details"
          icon={Building}
        >
          <div className={styles.fieldGrid}>
            <Field
              label="Insurance Company"
              required
              error={errors.insuranceCompany?.message}
              className={styles.fieldContainer}
            >
              <Controller
                name="insuranceCompany"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={insuranceCompanies.map(company => ({
                      value: company,
                      label: company
                    }))}
                    placeholder="Select insurance company"
                    state={errors.insuranceCompany ? 'error' : 'default'}
                    leftIcon={<Building />}
                  />
                )}
              />
            </Field>

            <Field
              label="Adjustor Name"
              required
              error={errors.adjustorName?.message}
              className={styles.fieldContainer}
            >
              <Controller
                name="adjustorName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="John Smith"
                    state={errors.adjustorName ? 'error' : 'default'}
                    leftIcon={<User />}
                  />
                )}
              />
            </Field>
          </div>

          <Field
            label="Adjustor Email"
            required
            error={errors.adjustorEmail?.message}
            className={styles.fieldContainer}
          >
            <Controller
              name="adjustorEmail"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="adjustor@insurance.com"
                  state={errors.adjustorEmail ? 'error' : 'default'}
                  leftIcon={<Mail />}
                />
              )}
            />
          </Field>
        </FormSection>

        {/* Client Information Section */}
        <FormSection
          title="Client Information"
          description="Policyholder contact details"
          icon={User}
        >
          <div className={styles.fieldGrid}>
            <Field
              label="Client Name"
              required
              error={errors.clientName?.message}
              className={styles.fieldContainer}
            >
              <Controller
                name="clientName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Jane Doe"
                    state={errors.clientName ? 'error' : 'default'}
                    leftIcon={<User />}
                  />
                )}
              />
            </Field>

            <Field
              label="Client Phone"
              required
              error={errors.clientPhone?.message}
              className={styles.fieldContainer}
            >
              <Controller
                name="clientPhone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    placeholder="(555) 123-4567"
                    state={errors.clientPhone ? 'error' : 'default'}
                    leftIcon={<Phone />}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                  />
                )}
              />
            </Field>
          </div>

          <Field
            label="Client Address"
            required
            error={errors.clientAddress?.message}
            className={styles.fieldContainer}
          >
            <Controller
              name="clientAddress"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="123 Main St, City, State 12345"
                  rows={2}
                  state={errors.clientAddress ? 'error' : 'default'}
                  leftIcon={<MapPin />}
                  autoResize
                />
              )}
            />
          </Field>
        </FormSection>

        {/* Form Actions */}
        <motion.div
          className={styles.formActions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className={styles.actionsLeft}>
            {isDirty && (
              <motion.div
                className={styles.dirtyIndicator}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <AlertCircle className={styles.dirtyIcon} />
                <span className={styles.dirtyText}>Unsaved changes</span>
              </motion.div>
            )}
          </div>

          <div className={styles.actionsRight}>
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
            >
              <X className={styles.buttonIcon} />
              {cancelText}
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={!isValid || loading}
            >
              {loading ? (
                <RefreshCw className={styles.buttonIcon} />
              ) : (
                <Save className={styles.buttonIcon} />
              )}
              {submitText || defaultSubmitText}
            </Button>
          </div>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default ClaimForm