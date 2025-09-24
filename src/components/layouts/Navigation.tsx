'use client'

import { TopBar } from './TopBar'

interface NavigationProps {
  children: React.ReactNode
  actions?: React.ReactNode
}

export function Navigation({ children, actions }: NavigationProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar actions={actions} />

      <main className="flex-1 pt-16">
        <div className="w-full py-6 px-4 sm:px-6">
          {children}
        </div>
      </main>
    </div>
  )
}