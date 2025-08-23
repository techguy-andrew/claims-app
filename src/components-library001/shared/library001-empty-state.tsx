'use client'

import React from 'react'
import { 
  Package, 
  FileText, 
  Upload, 
  Plus,
  Image,
  FolderOpen,
  Search,
  AlertCircle,
  type LucideIcon
} from 'lucide-react'

// ============================================================================
// LIBRARY001 EMPTY STATE - Beautiful Empty States with Call-to-Actions
// ============================================================================

interface Library001EmptyStateProps {
  icon?: LucideIcon | React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  variant?: 'default' | 'dashed' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Library001EmptyState({ 
  icon,
  title,
  description,
  action,
  variant = 'default',
  size = 'md',
  className = ''
}: Library001EmptyStateProps) {
  
  // Size configurations
  const sizeConfig = {
    sm: {
      iconContainer: 'w-12 h-12',
      iconSize: 'w-6 h-6',
      title: 'text-sm',
      description: 'text-xs',
      padding: 'p-6',
      gap: 'space-y-2'
    },
    md: {
      iconContainer: 'w-16 h-16',
      iconSize: 'w-8 h-8',
      title: 'text-base',
      description: 'text-sm',
      padding: 'p-8',
      gap: 'space-y-3'
    },
    lg: {
      iconContainer: 'w-20 h-20',
      iconSize: 'w-10 h-10',
      title: 'text-lg',
      description: 'text-base',
      padding: 'p-12',
      gap: 'space-y-4'
    }
  }

  const config = sizeConfig[size]

  // Variant styles
  const variantStyles = {
    default: 'bg-white border border-gray-200 shadow-sm',
    dashed: 'bg-gray-50/50 border-2 border-dashed border-gray-300',
    minimal: 'bg-transparent'
  }

  // Render icon based on type
  const renderIcon = () => {
    if (!icon) {
      return <Package className={`${config.iconSize} text-blue-600`} />
    }
    
    if (React.isValidElement(icon)) {
      return icon
    }
    
    const IconComponent = icon as LucideIcon
    return <IconComponent className={`${config.iconSize} text-blue-600`} />
  }

  return (
    <div className={`
      rounded-lg ${variantStyles[variant]} ${config.padding}
      flex flex-col items-center justify-center text-center
      ${className}
    `}>
      <div className={config.gap}>
        {/* Icon Container with Gradient */}
        <div className={`
          ${config.iconContainer} 
          rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 
          flex items-center justify-center mx-auto
          ${variant === 'minimal' ? '' : 'shadow-sm'}
        `}>
          {renderIcon()}
        </div>

        {/* Title */}
        <h3 className={`${config.title} font-semibold text-gray-900`}>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className={`${config.description} text-gray-600 max-w-sm mx-auto`}>
            {description}
          </p>
        )}

        {/* Action Button */}
        {action && (
          <button
            onClick={action.onClick}
            className={`
              inline-flex items-center gap-2 mt-2
              px-4 py-2 rounded-lg
              bg-blue-600 text-white font-medium ${config.description}
              hover:bg-blue-700 active:scale-95
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500/20
            `}
          >
            {action.icon}
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// PRESET EMPTY STATES - Common Patterns
// ============================================================================

export function Library001EmptyItems({ onAddItem }: { onAddItem?: () => void }) {
  return (
    <Library001EmptyState
      icon={Package}
      title="No items added yet"
      description="Start documenting damaged or claimed items"
      action={onAddItem ? {
        label: "Add First Item",
        onClick: onAddItem,
        icon: <Plus className="w-4 h-4" />
      } : undefined}
      variant="dashed"
    />
  )
}

export function Library001EmptyFiles({ onUpload }: { onUpload?: () => void }) {
  return (
    <Library001EmptyState
      icon={FileText}
      title="No files uploaded"
      description="Upload photos, documents, or receipts"
      action={onUpload ? {
        label: "Upload Files",
        onClick: onUpload,
        icon: <Upload className="w-4 h-4" />
      } : undefined}
      variant="dashed"
    />
  )
}

export function Library001EmptySearch() {
  return (
    <Library001EmptyState
      icon={Search}
      title="No results found"
      description="Try adjusting your search or filters"
      variant="minimal"
      size="sm"
    />
  )
}

export function Library001EmptyFolder() {
  return (
    <Library001EmptyState
      icon={FolderOpen}
      title="This folder is empty"
      description="Add files to get started"
      variant="minimal"
    />
  )
}

export function Library001EmptyGallery({ onAddImage }: { onAddImage?: () => void }) {
  return (
    <Library001EmptyState
      icon={Image}
      title="No images yet"
      description="Add photos to document the claim"
      action={onAddImage ? {
        label: "Add Photos",
        onClick: onAddImage,
        icon: <Plus className="w-4 h-4" />
      } : undefined}
      variant="default"
    />
  )
}

export function Library001ErrorState({ 
  title = "Something went wrong",
  description = "An error occurred while loading this content",
  onRetry
}: { 
  title?: string
  description?: string
  onRetry?: () => void 
}) {
  return (
    <Library001EmptyState
      icon={<AlertCircle className="w-8 h-8 text-red-600" />}
      title={title}
      description={description}
      action={onRetry ? {
        label: "Try Again",
        onClick: onRetry
      } : undefined}
      variant="default"
    />
  )
}

// Default export
export default Library001EmptyState