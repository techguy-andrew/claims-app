'use client'

import React from 'react'
import { library001Cn } from '../utils/library001-cn'

// ============================================================================
// TYPES
// ============================================================================

export interface Library001TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  resizable?: boolean
}

// ============================================================================
// STYLES
// ============================================================================

const textareaStyles = {
  base: 'flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
  error: 'border-red-300 focus:ring-red-500',
  noResize: 'resize-none'
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Library001Textarea = React.forwardRef<HTMLTextAreaElement, Library001TextareaProps>(
  ({ className, label, error, fullWidth = true, resizable = true, ...props }, ref) => {
    
    const textareaClasses = library001Cn(
      textareaStyles.base,
      error && textareaStyles.error,
      !resizable && textareaStyles.noResize,
      !fullWidth && 'w-auto',
      className
    )

    const textareaElement = (
      <textarea
        className={textareaClasses}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
    )

    if (!label && !error) {
      return textareaElement
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
        {textareaElement}
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

Library001Textarea.displayName = 'Library001Textarea'

export { Library001Textarea }
export default Library001Textarea