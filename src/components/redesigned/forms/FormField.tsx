'use client'

import React from 'react'
import { useFormContext, FieldError } from 'react-hook-form'
import { InvisibleInput, InvisibleTextInput, InvisibleTextArea } from '../core/InvisibleInput'
import { AlertCircle } from 'lucide-react'
import styles from './FormField.module.css'

// ============================================================================
// TYPES
// ============================================================================

interface BaseFormFieldProps {
  name: string
  label?: string
  description?: string
  required?: boolean
  className?: string
  disabled?: boolean
}

export interface FormFieldProps extends BaseFormFieldProps {
  placeholder?: string
  variant?: 'default' | 'title' | 'description' | 'small'
  multiline?: boolean
  autoSize?: boolean
}

export interface FormTextFieldProps extends BaseFormFieldProps {
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url'
}

export interface FormTextAreaProps extends BaseFormFieldProps {
  placeholder?: string
  rows?: number
  autoSize?: boolean
}

// ============================================================================
// FORM ERROR DISPLAY
// ============================================================================

interface FormErrorProps {
  error?: FieldError
  className?: string
}

const FormError: React.FC<FormErrorProps> = ({ error, className = '' }) => {
  if (!error) return null

  return (
    <div className={`${styles.error} ${className}`} role="alert">
      <AlertCircle className={styles.errorIcon} size={14} />
      <span className={styles.errorMessage}>{error.message}</span>
    </div>
  )
}

// ============================================================================
// FORM LABEL
// ============================================================================

interface FormLabelProps {
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

const FormLabel: React.FC<FormLabelProps> = ({ 
  htmlFor, 
  required, 
  children, 
  className = '' 
}) => {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`${styles.label} ${className}`}
    >
      {children}
      {required && <span className={styles.required} aria-label="required">*</span>}
    </label>
  )
}

// ============================================================================
// FORM DESCRIPTION
// ============================================================================

interface FormDescriptionProps {
  children: React.ReactNode
  className?: string
}

const FormDescription: React.FC<FormDescriptionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <p className={`${styles.description} ${className}`}>
      {children}
    </p>
  )
}

// ============================================================================
// MAIN FORM FIELD - InvisibleInput Integration
// ============================================================================

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  description,
  required = false,
  className = '',
  disabled = false,
  placeholder = '',
  variant = 'default',
  multiline = false,
  autoSize = true
}) => {
  const {
    register,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    trigger
  } = useFormContext()

  const error = errors[name] as FieldError | undefined
  const fieldId = `field-${name}`
  
  // InvisibleInput handlers that integrate with React Hook Form
  const handleChange = React.useCallback((value: string) => {
    setValue(name, value, { shouldValidate: true, shouldDirty: true })
  }, [setValue, name])

  const handleSave = React.useCallback(async () => {
    await trigger(name)
  }, [trigger, name])

  const handleCancel = React.useCallback(() => {
    // Reset to the original value from the form
    const currentValue = getValues(name)
    setValue(name, currentValue)
  }, [setValue, getValues, name])

  const fieldClassName = [
    styles.field,
    error && styles.hasError,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={fieldClassName}>
      {label && (
        <FormLabel htmlFor={fieldId} required={required}>
          {label}
        </FormLabel>
      )}
      
      {description && (
        <FormDescription>{description}</FormDescription>
      )}
      
      <div className={styles.inputWrapper}>
        <InvisibleInput
          {...register(name, { required: required ? `${label || 'This field'} is required` : false })}
          value={getValues(name) || ''}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={false} // Start in display mode
          placeholder={placeholder}
          variant={variant}
          multiline={multiline}
          autoSize={autoSize}
          disabled={disabled || isSubmitting}
          className={styles.input}
        />
      </div>
      
      <FormError error={error} />
    </div>
  )
}

// ============================================================================
// FORM TEXT FIELD - Standard Input Alternative
// ============================================================================

export const FormTextField: React.FC<FormTextFieldProps> = ({
  name,
  label,
  description,
  required = false,
  className = '',
  disabled = false,
  placeholder = '',
  type = 'text'
}) => {
  const {
    register,
    formState: { errors, isSubmitting }
  } = useFormContext()

  const error = errors[name] as FieldError | undefined
  const fieldId = `field-${name}`

  const fieldClassName = [
    styles.field,
    error && styles.hasError,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={fieldClassName}>
      {label && (
        <FormLabel htmlFor={fieldId} required={required}>
          {label}
        </FormLabel>
      )}
      
      {description && (
        <FormDescription>{description}</FormDescription>
      )}
      
      <div className={styles.inputWrapper}>
        <input
          id={fieldId}
          type={type}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          className={`${styles.standardInput} ${error ? styles.inputError : ''}`}
          {...register(name, { 
            required: required ? `${label || 'This field'} is required` : false 
          })}
        />
      </div>
      
      <FormError error={error} />
    </div>
  )
}

// ============================================================================
// FORM TEXT AREA
// ============================================================================

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  name,
  label,
  description,
  required = false,
  className = '',
  disabled = false,
  placeholder = '',
  rows = 4,
  autoSize = false
}) => {
  const {
    register,
    formState: { errors, isSubmitting }
  } = useFormContext()

  const error = errors[name] as FieldError | undefined
  const fieldId = `field-${name}`

  const fieldClassName = [
    styles.field,
    error && styles.hasError,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={fieldClassName}>
      {label && (
        <FormLabel htmlFor={fieldId} required={required}>
          {label}
        </FormLabel>
      )}
      
      {description && (
        <FormDescription>{description}</FormDescription>
      )}
      
      <div className={styles.inputWrapper}>
        <textarea
          id={fieldId}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          className={`${styles.standardTextarea} ${error ? styles.inputError : ''}`}
          style={{ resize: autoSize ? 'vertical' : 'none' }}
          {...register(name, { 
            required: required ? `${label || 'This field'} is required` : false 
          })}
        />
      </div>
      
      <FormError error={error} />
    </div>
  )
}

// ============================================================================
// FORM SECTION - Grouping Related Fields
// ============================================================================

interface FormSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <div className={`${styles.section} ${className}`}>
      {(title || description) && (
        <div className={styles.sectionHeader}>
          {title && <h3 className={styles.sectionTitle}>{title}</h3>}
          {description && <p className={styles.sectionDescription}>{description}</p>}
        </div>
      )}
      <div className={styles.sectionContent}>
        {children}
      </div>
    </div>
  )
}

// Export sub-components for flexibility
export { FormError, FormLabel, FormDescription }