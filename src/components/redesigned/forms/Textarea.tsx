'use client'

import React, { forwardRef, useCallback, useLayoutEffect, useRef } from 'react'
import styles from './Textarea.module.css'

// ============================================================================
// TYPES
// ============================================================================

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: 'small' | 'default' | 'large'
  variant?: 'default' | 'outline' | 'filled' | 'ghost'
  state?: 'default' | 'error' | 'success' | 'warning'
  fullWidth?: boolean
  resize?: 'vertical' | 'horizontal' | 'both' | 'none'
  mobileOptimized?: boolean
  inlineEditing?: boolean
  autoResize?: boolean
  minRows?: number
  maxRows?: number
  loading?: boolean
}

// ============================================================================
// COMPONENT
// ============================================================================

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    size = 'default', 
    variant = 'default',
    state = 'default', 
    fullWidth = false, 
    resize = 'vertical',
    mobileOptimized = true,
    inlineEditing = false,
    autoResize = false,
    minRows = 3,
    maxRows,
    loading = false,
    className, 
    disabled,
    onChange,
    ...props 
  }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null)
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef

    // Auto-resize functionality
    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea || !autoResize) return

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight

      // Calculate min and max heights
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20
      const minHeight = minRows * lineHeight + 24 // 24px for padding
      const maxHeight = maxRows ? maxRows * lineHeight + 24 : Infinity

      // Set the new height within constraints
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
      textarea.style.height = `${newHeight}px`
    }, [autoResize, minRows, maxRows, textareaRef])

    // Handle change with auto-resize
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e)
      adjustHeight()
    }, [onChange, adjustHeight])

    // Initial height adjustment
    useLayoutEffect(() => {
      if (autoResize) {
        adjustHeight()
      }
    }, [adjustHeight, autoResize, props.value, props.defaultValue])

    // Combine CSS classes using modern pattern
    const textareaClasses = [
      styles.textarea,
      styles[`size-${size}`],
      styles[`variant-${variant}`],
      styles[`state-${state}`],
      styles[`resize-${resize}`],
      fullWidth && styles.fullWidth,
      mobileOptimized && styles.mobileOptimized,
      inlineEditing && styles.inlineEditing,
      autoResize && styles.autoResize,
      loading && styles.loading,
      disabled && styles.disabled,
      className
    ].filter(Boolean).join(' ')

    const containerClasses = [
      styles.textareaContainer,
      fullWidth && styles.fullWidth,
      loading && styles.loading
    ].filter(Boolean).join(' ')

    return (
      <div className={containerClasses}>
        <textarea
          ref={textareaRef}
          className={textareaClasses}
          disabled={disabled || loading}
          rows={!autoResize ? minRows : undefined}
          onChange={handleChange}
          {...props}
        />
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner} />
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea