'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface EditableFieldProps {
  value: string
  label?: string
  placeholder?: string
  isEditing: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void
  className?: string
  labelClassName?: string
  fieldClassName?: string
  multiline?: boolean
  variant?: 'title' | 'body' | 'caption'
}

export function EditableField({
  value,
  label,
  placeholder,
  isEditing,
  onKeyDown,
  className,
  labelClassName,
  fieldClassName,
  multiline = false,
  variant = 'body',
}: EditableFieldProps) {
  const fieldRef = React.useRef<HTMLDivElement>(null)

  // Ensure the content reflects the current value
  React.useEffect(() => {
    if (fieldRef.current && fieldRef.current.textContent !== value) {
      fieldRef.current.textContent = value
    }
  }, [value, isEditing])

  // Focus the field when editing starts
  React.useEffect(() => {
    if (isEditing && fieldRef.current) {
      fieldRef.current.focus()
      // Place cursor at end of text
      const range = document.createRange()
      const selection = window.getSelection()
      if (fieldRef.current.childNodes.length > 0) {
        range.selectNodeContents(fieldRef.current)
        range.collapse(false)
      }
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [isEditing])

  const getVariantClasses = () => {
    switch (variant) {
      case 'title':
        return {
          base: "min-h-[1.75rem] leading-7 font-semibold text-sm sm:text-base",
          editing: "min-h-[1.75rem]"
        }
      case 'caption':
        return {
          base: "min-h-[1.25rem] leading-5 font-medium text-xs sm:text-sm",
          editing: "min-h-[1.25rem]"
        }
      default: // body
        return {
          base: "min-h-[1.25rem] leading-5 font-semibold text-sm sm:text-base",
          editing: "min-h-[1.25rem]"
        }
    }
  }

  const variantClasses = getVariantClasses()
  const isEmpty = !value || value.trim() === ''
  const displayText = isEmpty ? (placeholder || 'Click to edit') : value

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      {label && (
        <label className={cn(
          "text-xs sm:text-sm font-medium text-muted-foreground",
          labelClassName
        )}>
          {label}
        </label>
      )}
      <div
        ref={fieldRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onKeyDown={onKeyDown}
        className={cn(
          // Base styles - consistent across all states
          "outline-none w-full break-words transition-all duration-200",
          variantClasses.base,

          // Editing state styles
          isEditing && cn(
            "cursor-text",
            "focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0",
            "bg-background/50 backdrop-blur-sm",
            "border border-transparent focus:border-blue-200",
            "rounded-md px-2 py-1 -mx-2 -my-1", // Negative margins to prevent layout shift
            variantClasses.editing
          ),

          // Non-editing state styles
          !isEditing && cn(
            isEmpty && "text-muted-foreground/60 italic",
            "hover:bg-muted/30 rounded-md px-2 py-1 -mx-2 -my-1 transition-colors duration-150"
          ),

          // Multiline handling
          multiline && "whitespace-pre-wrap",
          !multiline && "whitespace-nowrap overflow-hidden text-ellipsis",

          fieldClassName
        )}
        style={{
          // Ensure consistent line height and prevent content jumping
          WebkitUserSelect: isEditing ? 'text' : 'none',
          userSelect: isEditing ? 'text' : 'none',
          // Prevent zoom on iOS
          fontSize: 'max(16px, 1em)',
        }}
      >
        {displayText}
      </div>
    </div>
  )
}