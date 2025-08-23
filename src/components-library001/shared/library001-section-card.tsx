'use client'

import React, { useState } from 'react'
import { ChevronDown, type LucideIcon } from 'lucide-react'

// ============================================================================
// LIBRARY001 SECTION CARD - Consistent Section Wrapper with Header Pattern
// ============================================================================

interface Library001SectionCardProps {
  icon?: LucideIcon | React.ReactNode
  title: string
  subtitle?: string
  badge?: string | number
  action?: React.ReactNode
  children: React.ReactNode
  collapsible?: boolean
  defaultExpanded?: boolean
  className?: string
  headerClassName?: string
  contentClassName?: string
  noPadding?: boolean
  transparent?: boolean
}

export function Library001SectionCard({
  icon,
  title,
  subtitle,
  badge,
  action,
  children,
  collapsible = false,
  defaultExpanded = true,
  className = '',
  headerClassName = '',
  contentClassName = '',
  noPadding = false,
  transparent = false
}: Library001SectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

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

  const handleToggle = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div className={`
      ${transparent ? '' : 'bg-white border border-gray-200 shadow-sm'} 
      rounded-lg transition-all duration-200
      ${isExpanded && !transparent ? 'border-gray-200' : ''}
      ${className}
    `}>
      {/* Header */}
      <div 
        className={`
          flex items-center justify-between 
          ${transparent ? '' : 'p-4 md:p-6'}
          ${collapsible ? 'cursor-pointer select-none' : ''}
          ${headerClassName}
        `}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {renderIcon()}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {title}
              </h2>
              {badge !== undefined && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {action}
          {collapsible && (
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation()
                handleToggle()
              }}
            >
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {(!collapsible || isExpanded) && (
        <div 
          className={`
            ${!transparent && !noPadding ? 'px-4 pb-4 md:px-6 md:pb-6' : ''}
            ${!transparent && (title || subtitle) ? 'border-t border-gray-100' : ''}
            ${contentClassName}
          `}
        >
          {!transparent && !noPadding && (title || subtitle) && (
            <div className="h-4" />
          )}
          {children}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// SPECIALIZED SECTION CARDS
// ============================================================================

interface Library001InfoSectionProps {
  title: string
  icon?: LucideIcon
  fields: Array<{
    label: string
    value: React.ReactNode
    icon?: LucideIcon
  }>
  action?: React.ReactNode
  columns?: 1 | 2 | 3
  className?: string
}

export function Library001InfoSection({
  title,
  icon,
  fields,
  action,
  columns = 2,
  className = ''
}: Library001InfoSectionProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  return (
    <Library001SectionCard
      title={title}
      icon={icon}
      action={action}
      className={className}
    >
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {fields.map((field, index) => (
          <div key={index} className="flex gap-3">
            {field.icon && (
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <field.icon className="w-5 h-5 text-gray-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                {field.label}
              </p>
              <div className="text-sm text-gray-900">
                {field.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Library001SectionCard>
  )
}

// ============================================================================
// LIBRARY001 SECTION HEADER - Standalone Section Header
// ============================================================================

interface Library001SectionHeaderProps {
  icon?: LucideIcon | React.ReactNode
  title: string
  subtitle?: string
  badge?: string | number
  action?: React.ReactNode
  className?: string
}

export function Library001SectionHeader({
  icon,
  title,
  subtitle,
  badge,
  action,
  className = ''
}: Library001SectionHeaderProps) {
  // Render icon based on type
  const renderIcon = () => {
    if (!icon) return null
    
    if (React.isValidElement(icon)) {
      return icon
    }
    
    const IconComponent = icon as LucideIcon
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <IconComponent className="w-5 h-5 text-blue-600" />
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        {renderIcon()}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            {badge !== undefined && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  )
}

// Default export
export default Library001SectionCard