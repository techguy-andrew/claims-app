'use client'

import React from 'react'
import Link from 'next/link'
import { BRAND } from '@/lib/navigation'
import { MobileNav } from './MobileNav'

interface TopBarProps {
  children?: React.ReactNode
  actions?: React.ReactNode
}

export function TopBar({ children, actions }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link
            href={BRAND.href}
            className="font-semibold text-lg hover:opacity-80 transition-opacity"
            aria-label={`${BRAND.name} - ${BRAND.description}`}
          >
            {BRAND.name}
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          {children}
        </div>

        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
    </header>
  )
}