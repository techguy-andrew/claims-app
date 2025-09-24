'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
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
import { cn } from '@/lib/utils'

export interface ItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  editable?: boolean
  onSave?: (data: { title: string; description: string }) => void
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
}

export function ItemCard({
  title: initialTitle = 'Click to edit title',
  description: initialDescription = 'Click to edit description',
  className,
  children,
  editable = false,
  onSave,
  onEdit,
  onDelete,
  onDuplicate,
  ...props
}: ItemCardProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [tempTitle, setTempTitle] = React.useState(initialTitle)
  const [tempDescription, setTempDescription] = React.useState(initialDescription)
  const titleRef = React.useRef<HTMLDivElement>(null)
  const descriptionRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setTempTitle(initialTitle)
    setTempDescription(initialDescription)
  }, [initialTitle, initialDescription])

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
    <Card className={cn('w-full', className)} {...props}>
      <CardHeader>
        <div className={cn(
          "grid grid-cols-[1fr,auto] gap-6 items-start",
        )}>
          <div className={cn(
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
          </div>

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
        <CardContent>
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