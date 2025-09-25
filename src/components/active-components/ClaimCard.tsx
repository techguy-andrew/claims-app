'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card'
import { Badge } from './badge'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { ClaimStatus } from '@prisma/client'
import { getStatusConfig } from '@/lib/status-config'

export interface ClaimCardProps extends React.HTMLAttributes<HTMLDivElement> {
  claimNumber: string
  clientName: string
  status: ClaimStatus
  href: string
}

export function ClaimCard({
  claimNumber,
  clientName,
  status,
  href,
  className,
  ...props
}: ClaimCardProps) {
  const statusConfig = getStatusConfig(status)

  return (
    <Link href={href} className="w-full h-full">
      <Card className={cn(
        'w-full h-full cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-md',
        className
      )} {...props}>
        <CardHeader className="p-4 sm:p-6">
          <div className="grid grid-cols-[1fr,auto] gap-4 sm:gap-6 items-start w-full">
            <div className="flex flex-col gap-2 sm:gap-3 min-w-0 flex-1">
              <CardTitle className="min-h-[1.75rem] leading-7 text-base sm:text-lg lg:text-xl break-words">{claimNumber}</CardTitle>
              <CardDescription className="min-h-[1.25rem] leading-5 text-sm sm:text-base break-words">{clientName}</CardDescription>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant={statusConfig.variant}
                className={`${statusConfig.className} text-xs sm:text-sm whitespace-nowrap transition-all duration-200`}
              >
                {statusConfig.label}
              </Badge>
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
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