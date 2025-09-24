'use client'

import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'

interface NavigationProps {
  children: React.ReactNode
  actions?: React.ReactNode
}

export function Navigation({ children, actions }: NavigationProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar actions={actions} />

      <div className="flex flex-1 pt-16">
        <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40">
          <Sidebar className="sticky top-16 h-[calc(100vh-4rem)]" />
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="container py-6 px-4 sm:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}