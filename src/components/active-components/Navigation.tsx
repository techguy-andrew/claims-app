'use client'

import { TopBar } from './TopBar'
import { ScrollToTop } from './ScrollToTop'

interface NavigationProps {
  children: React.ReactNode
  actions?: React.ReactNode
}

export function Navigation({ children, actions }: NavigationProps) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <ScrollToTop />
      <TopBar actions={actions} />

      <main className="flex-1 w-full pt-16">
        {children}
      </main>
    </div>
  )
}