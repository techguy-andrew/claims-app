'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Button } from './button'
import { MoreVertical, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ItemCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: string | null
  description?: string | null
  editable?: boolean
  onSave?: (data: { title: string; description: string }) => void
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
}

export function ItemCard({
  title: initialTitle,
  description: initialDescription,
  className,
  children,
  editable = false,
  onSave,
  onEdit,
  onDelete,
  onDuplicate,
  ...props
}: ItemCardProps) {
  // Handle null/undefined values with proper defaults
  const safeTitle = initialTitle || 'Click to edit title'
  const safeDescription = initialDescription || 'Click to edit description'
  const [isEditing, setIsEditing] = React.useState(false)
  const [tempTitle, setTempTitle] = React.useState(safeTitle)
  const [tempDescription, setTempDescription] = React.useState(safeDescription)
  const titleRef = React.useRef<HTMLDivElement>(null)
  const descriptionRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setTempTitle(safeTitle)
    setTempDescription(safeDescription)
  }, [safeTitle, safeDescription])

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

  return (
    <Card className={cn('w-full h-full', className)} {...props}>
      <CardHeader className="p-4 sm:p-6">
        <div className={cn(
          "grid grid-cols-[1fr,auto] gap-4 sm:gap-6 items-start w-full",
        )}>
          <div className={cn(
            "flex flex-col gap-2 sm:gap-3 min-w-0 flex-1",
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
                "text-base sm:text-lg lg:text-xl",
                "break-words w-full",
                isEditing && "cursor-text"
              )}
            >
              {safeTitle}
            </CardTitle>

            <CardDescription
              ref={descriptionRef}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onKeyDown={handleKeyDown}
              className={cn(
                "outline-none",
                "min-h-[1.25rem]",
                "leading-5",
                "text-sm sm:text-base",
                "break-words w-full",
                isEditing && "cursor-text"
              )}
            >
              {safeDescription}
            </CardDescription>
          </div>

          {(editable || onEdit || onDelete || onDuplicate) && (
            <div className="flex items-center gap-1 shrink-0">
              {isEditing ? (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 sm:h-8 sm:w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={handleSave}
                    aria-label="Save changes"
                  >
                    <Check className="h-5 w-5 sm:h-4 sm:w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 sm:h-8 sm:w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleCancel}
                    aria-label="Cancel changes"
                  >
                    <X className="h-5 w-5 sm:h-4 sm:w-4" />
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 sm:h-8 sm:w-8"
                      aria-label="More options"
                    >
                      <MoreVertical className="h-5 w-5 sm:h-4 sm:w-4" />
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

                    {onDelete && (
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

      {children && (
        <CardContent className="p-4 sm:p-6 pt-0 w-full">
          {children}
        </CardContent>
      )}
    </Card>
  )
}

export function ItemCardGrid({
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

export function ItemCardStack({
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