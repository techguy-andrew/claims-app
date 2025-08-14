'use client'

import React, { forwardRef, useId } from 'react'
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import styles from './Label.module.css'

// ============================================================================
// TYPES
// ============================================================================

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  size?: 'small' | 'default' | 'large'
  variant?: 'default' | 'subtle' | 'strong'
  required?: boolean
  disabled?: boolean
  error?: boolean
  success?: boolean
  warning?: boolean
  children: React.ReactNode
}

export interface FieldProps {
  label?: string
  labelProps?: Omit<LabelProps, 'children'>
  required?: boolean
  disabled?: boolean
  error?: string | boolean
  success?: string | boolean
  warning?: string | boolean
  helperText?: string
  size?: 'small' | 'default' | 'large'
  className?: string
  children: React.ReactNode
}

// ============================================================================
// LABEL COMPONENT
// ============================================================================

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ 
    size = 'default', 
    variant = 'default',
    required = false, 
    disabled = false, 
    error = false,
    success = false,
    warning = false,
    className, 
    children,
    ...props 
  }, ref) => {
    // Combine CSS classes using modern pattern
    const labelClasses = [
      styles.label,
      styles[`size-${size}`],
      styles[`variant-${variant}`],
      required && styles.required,
      disabled && styles.disabled,
      error && styles.error,
      success && styles.success,
      warning && styles.warning,
      className
    ].filter(Boolean).join(' ')

    return (
      <label
        ref={ref}
        className={labelClasses}
        {...props}
      >
        <span className={styles.labelText}>
          {children}
          {required && (
            <span className={styles.requiredIndicator} aria-label="required">
              *
            </span>
          )}
        </span>
      </label>
    )
  }
)

Label.displayName = 'Label'

// ============================================================================
// FIELD COMPONENT - Complete form field composition
// ============================================================================

export const Field: React.FC<FieldProps> = ({ 
  label, 
  labelProps,
  required = false, 
  disabled = false, 
  error, 
  success,
  warning,
  helperText, 
  size = 'default',
  className,
  children 
}) => {
  const fieldId = useId()
  const helperId = useId()
  
  // Determine state priority: error > warning > success
  const hasError = Boolean(error)
  const hasWarning = Boolean(warning) && !hasError
  const hasSuccess = Boolean(success) && !hasError && !hasWarning
  
  // Get message text
  const errorText = typeof error === 'string' ? error : ''
  const warningText = typeof warning === 'string' ? warning : ''
  const successText = typeof success === 'string' ? success : ''
  
  // Primary message to display
  const primaryMessage = errorText || warningText || successText || helperText
  
  // Icon for the message
  const MessageIcon = hasError 
    ? AlertCircle
    : hasWarning 
    ? AlertTriangle
    : hasSuccess 
    ? CheckCircle
    : helperText 
    ? Info
    : null

  // Field container classes
  const fieldClasses = [
    styles.fieldContainer,
    styles[`size-${size}`],
    hasError && styles.fieldError,
    hasWarning && styles.fieldWarning,
    hasSuccess && styles.fieldSuccess,
    disabled && styles.fieldDisabled,
    className
  ].filter(Boolean).join(' ')

  // Message classes
  const messageClasses = [
    styles.helperText,
    hasError && styles.helperError,
    hasWarning && styles.helperWarning,
    hasSuccess && styles.helperSuccess
  ].filter(Boolean).join(' ')

  return (
    <div className={fieldClasses}>
      {label && (
        <Label 
          htmlFor={fieldId}
          size={size} 
          required={required} 
          disabled={disabled} 
          error={hasError}
          success={hasSuccess}
          warning={hasWarning}
          {...labelProps}
        >
          {label}
        </Label>
      )}
      
      <div className={styles.fieldInput}>
        {React.isValidElement(children) 
          ? React.cloneElement(children as React.ReactElement<any>, {
              id: fieldId,
              'aria-describedby': primaryMessage ? helperId : undefined,
              'aria-invalid': hasError ? 'true' : undefined,
              disabled: disabled || children.props.disabled,
              ...children.props
            })
          : children
        }
      </div>
      
      {primaryMessage && (
        <div 
          id={helperId}
          className={messageClasses}
          role={hasError ? 'alert' : 'status'}
          aria-live={hasError ? 'assertive' : 'polite'}
        >
          {MessageIcon && (
            <MessageIcon className={styles.messageIcon} />
          )}
          <span className={styles.messageText}>
            {primaryMessage}
          </span>
        </div>
      )}
    </div>
  )
}

export default Label