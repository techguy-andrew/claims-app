'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'
import { library001Cn } from '../utils/library001-cn'

// ============================================================================
// TYPES
// ============================================================================

export interface Library001SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface Library001SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  error?: string
  options: Library001SelectOption[]
  placeholder?: string
  fullWidth?: boolean
}

// ============================================================================
// STYLES
// ============================================================================

const selectStyles = {
  base: 'flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer',
  error: 'border-red-300 focus:ring-red-500',
  placeholder: 'text-gray-400'
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Library001Select = React.forwardRef<HTMLSelectElement, Library001SelectProps>(
  ({ className, label, error, options, placeholder, fullWidth = true, value, ...props }, ref) => {
    
    const selectClasses = library001Cn(
      selectStyles.base,
      error && selectStyles.error,
      !value && placeholder && selectStyles.placeholder,
      !fullWidth && 'w-auto',
      className
    )

    const selectElement = (
      <div className="relative">
        <select
          className={selectClasses}
          ref={ref}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    )

    if (!label && !error) {
      return selectElement
    }

    return (
      <div className={library001Cn('space-y-2', fullWidth ? 'w-full' : 'inline-block')}>
        {label && (
          <label 
            htmlFor={props.id}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        {selectElement}
        {error && (
          <p 
            id={`${props.id}-error`}
            className="text-xs text-red-600 mt-1"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Library001Select.displayName = 'Library001Select'

export { Library001Select }
export default Library001Select