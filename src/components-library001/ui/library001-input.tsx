'use client'

import React from 'react'
import { library001Cn } from '../utils/library001-cn'

// ============================================================================
// TYPES
// ============================================================================

export interface Library001InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  fullWidth?: boolean
}

// ============================================================================
// STYLES
// ============================================================================

const inputStyles = {
  base: 'flex h-10 w-full rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
  error: 'border-red-300 focus:ring-red-500',
  withIcon: 'pl-10'
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Library001Input = React.forwardRef<HTMLInputElement, Library001InputProps>(
  ({ className, type, label, error, icon, fullWidth = true, ...props }, ref) => {
    
    const inputClasses = library001Cn(
      inputStyles.base,
      error && inputStyles.error,
      !!icon && inputStyles.withIcon,
      !fullWidth && 'w-auto',
      className
    )

    const inputElement = (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={inputClasses}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
      </div>
    )

    if (!label && !error) {
      return inputElement
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
        {inputElement}
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

Library001Input.displayName = 'Library001Input'

export { Library001Input }
export default Library001Input