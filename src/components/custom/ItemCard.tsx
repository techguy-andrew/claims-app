'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface ItemCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  footer?: React.ReactNode
  headerAction?: React.ReactNode
  contentClassName?: string
  headerClassName?: string
  footerClassName?: string
}

export function ItemCard({
  title,
  description,
  footer,
  headerAction,
  children,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  ...props
}: ItemCardProps) {
  return (
    <Card className={cn('w-full', className)} {...props}>
      {(title || description || headerAction) && (
        <CardHeader className={cn(headerClassName)}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {title && (
                <CardTitle className="truncate">
                  {title}
                </CardTitle>
              )}
              {description && (
                <CardDescription className="mt-1.5">
                  {description}
                </CardDescription>
              )}
            </div>
            {headerAction && (
              <div className="flex-shrink-0">{headerAction}</div>
            )}
          </div>
        </CardHeader>
      )}
      
      {children && (
        <CardContent className={cn(contentClassName)}>
          {children}
        </CardContent>
      )}
      
      {footer && (
        <CardFooter className={cn(footerClassName)}>
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}

export interface ItemCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  minItemWidth?: string
  gap?: 2 | 3 | 4 | 5 | 6 | 8
}

export function ItemCardGrid({
  children,
  minItemWidth = '300px',
  gap = 4,
  className,
  style,
  ...props
}: ItemCardGridProps) {
  const gapClass = `gap-${gap}`
  
  return (
    <div
      className={cn(
        'grid',
        gapClass,
        className
      )}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minItemWidth}, 100%), 1fr))`,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export interface ItemCardStackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  gap?: 2 | 3 | 4 | 5 | 6 | 8
  direction?: 'vertical' | 'horizontal'
}

export function ItemCardStack({
  children,
  gap = 4,
  direction = 'vertical',
  className,
  ...props
}: ItemCardStackProps) {
  const gapClass = `gap-${gap}`
  const directionClass = direction === 'vertical' ? 'flex-col' : 'flex-row'
  
  return (
    <div
      className={cn(
        'flex',
        directionClass,
        gapClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}