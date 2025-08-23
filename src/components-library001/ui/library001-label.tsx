'use client'

import React from 'react'
import { library001Cn } from '../utils/library001-cn'

// ============================================================================
// TYPES
// ============================================================================

export interface Library001LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  disabled?: boolean
  children: React.ReactNode
}

// ============================================================================
// STYLES
// ============================================================================

const labelStyles = {
  base: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  default: 'text-gray-700',
  disabled: 'text-gray-400 cursor-not-allowed'
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Library001Label = React.forwardRef<HTMLLabelElement, Library001LabelProps>(
  ({ className, required, disabled, children, ...props }, ref) => {
    
    const labelClasses = library001Cn(
      labelStyles.base,
      disabled ? labelStyles.disabled : labelStyles.default,
      className
    )

    return (
      <label
        ref={ref}
        className={labelClasses}
        {...props}
      >
        {children}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
    )
  }
)

Library001Label.displayName = 'Library001Label'

export { Library001Label }
export default Library001Label