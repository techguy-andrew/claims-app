'use client'

import React, { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './Select.module.css'

// ============================================================================
// TYPES
// ============================================================================

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'small' | 'default' | 'large'
  variant?: 'default' | 'outline' | 'filled' | 'ghost'
  state?: 'default' | 'error' | 'success' | 'warning'
  fullWidth?: boolean
  loading?: boolean
  placeholder?: string
  options?: SelectOption[]
  mobileOptimized?: boolean
  inlineEditing?: boolean
}

// ============================================================================
// COMPONENT
// ============================================================================

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    size = 'default', 
    variant = 'default',
    state = 'default', 
    fullWidth = false,
    loading = false,
    placeholder,
    options = [],
    mobileOptimized = true,
    inlineEditing = false,
    className, 
    children,
    disabled,
    ...props 
  }, ref) => {
    // Combine CSS classes using modern pattern
    const containerClasses = [
      styles.selectContainer,
      styles[`size-${size}`],
      styles[`variant-${variant}`],
      styles[`state-${state}`],
      fullWidth && styles.fullWidth,
      loading && styles.loading,
      mobileOptimized && styles.mobileOptimized,
      inlineEditing && styles.inlineEditing,
      disabled && styles.disabled,
      className
    ].filter(Boolean).join(' ')

    const selectClasses = [
      styles.select
    ].filter(Boolean).join(' ')

    // Group options by group property if present
    const groupedOptions = options.reduce<Record<string, SelectOption[]>>((acc, option) => {
      const group = option.group || 'default'
      if (!acc[group]) acc[group] = []
      acc[group].push(option)
      return acc
    }, {})

    const hasGroups = Object.keys(groupedOptions).length > 1 || (Object.keys(groupedOptions).length === 1 && !groupedOptions.default)

    return (
      <div className={containerClasses}>
        <select
          ref={ref}
          className={selectClasses}
          disabled={loading || disabled}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.length > 0 ? (
            hasGroups ? (
              Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                <optgroup key={groupName} label={groupName === 'default' ? '' : groupName}>
                  {groupOptions.map((option) => (
                    <option 
                      key={option.value} 
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))
            ) : (
              options.map((option) => (
                <option 
                  key={option.value} 
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))
            )
          ) : (
            children
          )}
        </select>
        
        {/* Custom Arrow Icon */}
        <div className={styles.selectArrow}>
          {loading ? (
            <div className={styles.loadingSpinner} />
          ) : (
            <ChevronDown className={styles.arrowIcon} />
          )}
        </div>
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select