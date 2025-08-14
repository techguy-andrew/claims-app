'use client'

import React, { forwardRef } from 'react'
import styles from './Input.module.css'

// ============================================================================
// TYPES
// ============================================================================

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'small' | 'default' | 'large'
  variant?: 'default' | 'outline' | 'filled' | 'ghost'
  state?: 'default' | 'error' | 'success' | 'warning'
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  mobileOptimized?: boolean
  inlineEditing?: boolean
  loading?: boolean
}

// ============================================================================
// COMPONENT
// ============================================================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    size = 'default', 
    variant = 'default',
    state = 'default', 
    fullWidth = false, 
    leftIcon, 
    rightIcon, 
    mobileOptimized = true, // Default to mobile optimized in redesigned architecture
    inlineEditing = false,
    loading = false,
    className, 
    disabled,
    ...props 
  }, ref) => {
    // Combine CSS classes using modern pattern
    const inputClasses = [
      styles.input,
      styles[`size-${size}`],
      styles[`variant-${variant}`],
      styles[`state-${state}`],
      fullWidth && styles.fullWidth,
      leftIcon && styles.withLeftIcon,
      rightIcon && styles.withRightIcon,
      mobileOptimized && styles.mobileOptimized,
      inlineEditing && styles.inlineEditing,
      loading && styles.loading,
      disabled && styles.disabled,
      className
    ].filter(Boolean).join(' ')

    // Container classes for icon support
    const containerClasses = [
      styles.inputContainer,
      fullWidth && styles.fullWidth,
      (leftIcon || rightIcon) && styles.withIcons
    ].filter(Boolean).join(' ')

    // If icons are present, render with icon container
    if (leftIcon || rightIcon) {
      return (
        <div className={containerClasses}>
          {leftIcon && (
            <div className={styles.iconLeft}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            disabled={disabled || loading}
            {...props}
          />
          {rightIcon && !loading && (
            <div className={styles.iconRight}>
              {rightIcon}
            </div>
          )}
          {loading && (
            <div className={styles.iconRight}>
              <div className={styles.loadingSpinner} />
            </div>
          )}
        </div>
      )
    }

    // Standard input without icons
    return (
      <div className={containerClasses}>
        <input
          ref={ref}
          className={inputClasses}
          disabled={disabled || loading}
          {...props}
        />
        {loading && (
          <div className={styles.iconRight}>
            <div className={styles.loadingSpinner} />
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input