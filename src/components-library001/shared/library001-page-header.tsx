'use client'

import React from 'react'
import { ChevronRight, ArrowLeft, type LucideIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

// ============================================================================
// LIBRARY001 PAGE HEADER - Consistent Page Headers with Breadcrumbs
// ============================================================================

interface Breadcrumb {
  label: string
  href?: string
  onClick?: () => void
}

interface Library001PageHeaderProps {
  breadcrumbs?: Breadcrumb[]
  title: string
  subtitle?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
  backButton?: boolean
  backHref?: string
  onBack?: () => void
  icon?: LucideIcon | React.ReactNode
  className?: string
}

export function Library001PageHeader({
  breadcrumbs,
  title,
  subtitle,
  badge,
  actions,
  backButton = false,
  backHref,
  onBack,
  icon,
  className = ''
}: Library001PageHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  // Render icon based on type
  const renderIcon = () => {
    if (!icon) return null
    
    if (React.isValidElement(icon)) {
      return icon
    }
    
    const IconComponent = icon as LucideIcon
    return (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <IconComponent className="w-6 h-6 text-blue-600" />
      </div>
    )
  }

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="px-4 sm:px-6 py-4">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-sm mb-3">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                {crumb.href || crumb.onClick ? (
                  <button
                    onClick={() => {
                      if (crumb.onClick) {
                        crumb.onClick()
                      } else if (crumb.href) {
                        router.push(crumb.href)
                      }
                    }}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-gray-900 font-medium">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Main Header Content */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            {backButton && (
              <button
                onClick={handleBack}
                className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}

            {/* Icon */}
            {renderIcon()}

            {/* Title Section */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {title}
                </h1>
                {badge}
              </div>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// LIBRARY001 STATUS BADGE - Consistent Status Display
// ============================================================================

interface Library001StatusBadgeProps {
  status: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Library001StatusBadge({
  status,
  variant,
  size = 'md',
  className = ''
}: Library001StatusBadgeProps) {
  // Auto-detect variant if not provided
  const getVariant = () => {
    if (variant) return variant
    
    const upperStatus = status.toUpperCase()
    if (['OPEN', 'NEW', 'PENDING'].includes(upperStatus)) return 'info'
    if (['IN_PROGRESS', 'PROCESSING', 'UNDER_REVIEW'].includes(upperStatus)) return 'warning'
    if (['APPROVED', 'COMPLETED', 'SUCCESS'].includes(upperStatus)) return 'success'
    if (['DENIED', 'FAILED', 'ERROR'].includes(upperStatus)) return 'error'
    return 'default'
  }

  const variantStyles = {
    default: 'bg-gray-50 text-gray-700 border-gray-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200'
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  const finalVariant = getVariant()

  return (
    <span className={`
      inline-flex items-center font-medium rounded-lg border
      ${variantStyles[finalVariant]}
      ${sizeStyles[size]}
      ${className}
    `}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

// ============================================================================
// LIBRARY001 PAGE ACTIONS - Common Page Action Buttons
// ============================================================================

interface Library001PageActionProps {
  label: string
  onClick: () => void
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  className?: string
}

export function Library001PageAction({
  label,
  onClick,
  icon,
  variant = 'secondary',
  size = 'md',
  loading = false,
  disabled = false,
  className = ''
}: Library001PageActionProps) {
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center gap-2 font-medium rounded-lg
        transition-all duration-200 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500/20
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {label}
    </button>
  )
}

// Default export
export default Library001PageHeader