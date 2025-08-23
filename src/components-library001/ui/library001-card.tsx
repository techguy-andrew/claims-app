'use client'

import React from 'react'
import { library001Cn } from '../utils/library001-cn'

// ============================================================================
// TYPES
// ============================================================================

export interface Library001CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'enterprise' | 'bordered'
  padding?: 'none' | 'sm' | 'default' | 'lg'
  hoverable?: boolean
  clickable?: boolean
  children: React.ReactNode
}

export interface Library001CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface Library001CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface Library001CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

// ============================================================================
// STYLES
// ============================================================================

const cardVariants = {
  default: 'bg-white border border-gray-200 shadow-sm',
  glass: 'bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-sm',
  enterprise: 'bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)]',
  bordered: 'bg-white border-2 border-gray-200'
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  default: 'p-6',
  lg: 'p-8'
}

// ============================================================================
// MAIN COMPONENTS
// ============================================================================

const Library001Card = React.forwardRef<HTMLDivElement, Library001CardProps>(
  ({ 
    className, 
    variant = 'default', 
    padding = 'default', 
    hoverable = false, 
    clickable = false,
    children,
    ...props 
  }, ref) => {
    
    const cardClasses = library001Cn(
      'rounded-lg transition-all duration-200',
      cardVariants[variant],
      paddingStyles[padding],
      hoverable && 'hover:shadow-md hover:-translate-y-0.5',
      clickable && 'cursor-pointer active:scale-[0.99]',
      className
    )

    return (
      <div
        ref={ref}
        className={cardClasses}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Library001Card.displayName = 'Library001Card'

const Library001CardHeader = React.forwardRef<HTMLDivElement, Library001CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={library001Cn('flex flex-col space-y-1.5', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Library001CardHeader.displayName = 'Library001CardHeader'

const Library001CardContent = React.forwardRef<HTMLDivElement, Library001CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={library001Cn('pt-6', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Library001CardContent.displayName = 'Library001CardContent'

const Library001CardFooter = React.forwardRef<HTMLDivElement, Library001CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={library001Cn('flex items-center pt-6', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Library001CardFooter.displayName = 'Library001CardFooter'

// ============================================================================
// EXPORTS
// ============================================================================

export { 
  Library001Card, 
  Library001CardHeader, 
  Library001CardContent, 
  Library001CardFooter 
}

export default Library001Card