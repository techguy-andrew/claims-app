'use client'

import { usePathname } from 'next/navigation'
import { Home, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  description?: string
  requiresAuth?: boolean
}

export const NAVIGATION: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: Home,
    description: 'Dashboard overview and analytics',
    requiresAuth: false
  },
  {
    href: '/claims',
    label: 'Claims',
    icon: FileText,
    description: 'Manage insurance claims',
    requiresAuth: false
  }
] as const

export const BRAND = {
  name: 'Claims App',
  href: '/',
  description: 'Streamlined claims management'
} as const

export function useNavigation() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return { NAVIGATION, isActive, pathname }
}