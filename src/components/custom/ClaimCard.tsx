'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

export interface ClaimCardProps extends React.HTMLAttributes<HTMLDivElement> {
  claimNumber: string
  clientName: string
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  href: string
}

export function ClaimCard({
  claimNumber,
  clientName,
  status = 'pending',
  href,
  className,
  ...props
}: ClaimCardProps) {
  return (
    <Link href={href} className="w-full">
      <Card className={cn(
        'w-full cursor-pointer transition-colors hover:bg-accent',
        className
      )} {...props}>
        <CardHeader>
          <div className="grid grid-cols-[1fr,auto] gap-6 items-start">
            <div className="flex flex-col gap-3">
              <CardTitle>{claimNumber}</CardTitle>
              <CardDescription>{clientName}</CardDescription>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {status && (
                <Badge variant={
                  status === 'completed' ? 'default' :
                  status === 'in-progress' ? 'secondary' :
                  status === 'cancelled' ? 'destructive' :
                  'outline'
                }>
                  {status}
                </Badge>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}

export function ClaimCardGrid({
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

export function ClaimCardStack({
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