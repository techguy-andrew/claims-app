'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// Import shadcn/ui components as needed
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Check, X } from 'lucide-react'

// ============================================================================
// COMPONENT: [ComponentName]
// ============================================================================
// Description: [Brief description of what this component does]
// Based on: ItemCard.tsx reference architecture
// Last Updated: [Date]
// ============================================================================

// ----------------------------------------------------------------------------
// Type Definitions
// ----------------------------------------------------------------------------

export interface [ComponentName]Props extends React.HTMLAttributes<HTMLDivElement> {
  // Required props
  title: string
  
  // Optional display props
  description?: string
  subtitle?: string
  
  // Optional behavior props
  editable?: boolean
  deletable?: boolean
  
  // Optional callbacks
  onSave?: (data: { title: string; description: string }) => void
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  
  // Optional state props
  loading?: boolean
  disabled?: boolean
  selected?: boolean
}

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------

export function [ComponentName]({
  // Required props
  title: initialTitle,
  
  // Optional props with defaults
  description: initialDescription = '',
  subtitle,
  className,
  children,
  
  // Behavior props
  editable = false,
  deletable = false,
  
  // Callbacks
  onSave,
  onEdit,
  onDelete,
  onDuplicate,
  
  // State props
  loading = false,
  disabled = false,
  selected = false,
  
  ...props
}: [ComponentName]Props) {
  // ------------------------------------------------------------------------
  // State Management (following ItemCard pattern)
  // ------------------------------------------------------------------------
  const [isEditing, setIsEditing] = React.useState(false)
  const [tempTitle, setTempTitle] = React.useState(initialTitle)
  const [tempDescription, setTempDescription] = React.useState(initialDescription)
  
  // Refs for direct DOM manipulation (contentEditable)
  const titleRef = React.useRef<HTMLDivElement>(null)
  const descriptionRef = React.useRef<HTMLDivElement>(null)
  
  // ------------------------------------------------------------------------
  // Effects
  // ------------------------------------------------------------------------
  React.useEffect(() => {
    setTempTitle(initialTitle)
    setTempDescription(initialDescription)
  }, [initialTitle, initialDescription])
  
  // ------------------------------------------------------------------------
  // Event Handlers
  // ------------------------------------------------------------------------
  const handleEdit = () => {
    setIsEditing(true)
    onEdit?.()
  }
  
  const handleSave = () => {
    if (titleRef.current && descriptionRef.current) {
      const newTitle = titleRef.current.textContent || ''
      const newDescription = descriptionRef.current.textContent || ''
      onSave?.({ title: newTitle, description: newDescription })
      setTempTitle(newTitle)
      setTempDescription(newDescription)
    }
    setIsEditing(false)
  }
  
  const handleCancel = () => {
    if (titleRef.current && descriptionRef.current) {
      titleRef.current.textContent = tempTitle
      descriptionRef.current.textContent = tempDescription
    }
    setIsEditing(false)
  }
  
  // Keyboard navigation (accessibility)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (isEditing) {
        handleSave()
      }
    }
    if (e.key === 'Escape' && isEditing) {
      e.preventDefault()
      handleCancel()
    }
  }
  
  // ------------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------------
  return (
    <Card 
      className={cn(
        'w-full',
        selected && 'ring-2 ring-primary',
        disabled && 'opacity-50 pointer-events-none',
        className
      )} 
      {...props}
    >
      <CardHeader>
        {/* Grid Layout: Content + Actions (ItemCard pattern) */}
        <div className="grid grid-cols-[1fr,auto] gap-6 items-start">
          
          {/* Content Stack (flex flex-col gap-3) */}
          <div 
            className={cn(
              "flex flex-col gap-3",
              editable && "cursor-pointer"
            )}
            onDoubleClick={() => editable && !isEditing && handleEdit()}
          >
            <CardTitle
              ref={titleRef}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onKeyDown={handleKeyDown}
              className={cn(
                "outline-none",
                "min-h-[1.75rem]",
                "leading-7",
                isEditing && "cursor-text"
              )}
            >
              {initialTitle}
            </CardTitle>
            
            {subtitle && (
              <div className="text-sm text-muted-foreground">
                {subtitle}
              </div>
            )}
            
            {initialDescription && (
              <CardDescription
                ref={descriptionRef}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onKeyDown={handleKeyDown}
                className={cn(
                  "outline-none",
                  "min-h-[1.25rem]",
                  "leading-5",
                  isEditing && "cursor-text"
                )}
              >
                {initialDescription}
              </CardDescription>
            )}
          </div>
          
          {/* Actions Container (flex items-center gap-1 shrink-0) */}
          {(editable || onEdit || onDelete || onDuplicate) && (
            <div className="flex items-center gap-1 shrink-0">
              {isEditing ? (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={handleSave}
                    aria-label="Save changes"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleCancel}
                    aria-label="Cancel changes"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      aria-label="More options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent align="end">
                    {(editable || onEdit) && (
                      <DropdownMenuItem onClick={editable ? handleEdit : onEdit}>
                        Edit
                      </DropdownMenuItem>
                    )}
                    
                    {onDuplicate && (
                      <DropdownMenuItem onClick={onDuplicate}>
                        Duplicate
                      </DropdownMenuItem>
                    )}
                    
                    {onDelete && deletable && (
                      <DropdownMenuItem 
                        onClick={onDelete}
                        className="text-red-600 focus:text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      {/* Optional Body Content */}
      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
      
      {/* Optional Footer (uncomment if needed) */}
      {/* <CardFooter>
        Footer content
      </CardFooter> */}
    </Card>
  )
}

// ----------------------------------------------------------------------------
// Utility Components (following ItemCard pattern)
// ----------------------------------------------------------------------------

/**
 * Grid layout for multiple [ComponentName] instances
 * Responsive: 1 column mobile, 2 tablet, 3-4 desktop
 */
export function [ComponentName]Grid({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Stack layout for [ComponentName] instances
 * Supports vertical/horizontal direction and configurable spacing
 */
export function [ComponentName]Stack({
  children,
  className,
  direction = 'vertical',
  spacing = 'normal',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  direction?: 'vertical' | 'horizontal'
  spacing?: 'tight' | 'normal' | 'loose'
}) {
  const spacingClasses = {
    tight: 'gap-2',
    normal: 'gap-4',
    loose: 'gap-6',
  }
  
  return (
    <div 
      className={cn(
        'flex w-full',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        spacingClasses[spacing],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}

// ----------------------------------------------------------------------------
// Usage Examples (remove in production)
// ----------------------------------------------------------------------------

/*
// Basic Usage:
<[ComponentName]
  title="Example Title"
  description="Example description text"
  editable={true}
  onSave={handleSave}
  onDelete={handleDelete}
/>

// With Grid Layout:
<[ComponentName]Grid>
  <[ComponentName] title="Item 1" />
  <[ComponentName] title="Item 2" />
  <[ComponentName] title="Item 3" />
</[ComponentName]Grid>

// With Stack Layout:
<[ComponentName]Stack direction="vertical" spacing="tight">
  <[ComponentName] title="First" />
  <[ComponentName] title="Second" />
  <[ComponentName] title="Third" />
</[ComponentName]Stack>

// With Custom Content:
<[ComponentName] title="Custom Content">
  <div className="flex flex-col gap-2">
    <p>Custom content goes here</p>
    <Button>Action</Button>
  </div>
</[ComponentName]>
*/