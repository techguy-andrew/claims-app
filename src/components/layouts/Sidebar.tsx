'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useNavigation } from '@/lib/navigation'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  onLinkClick?: () => void
  className?: string
}

export function Sidebar({ onLinkClick, className }: SidebarProps) {
  const { NAVIGATION, isActive } = useNavigation()

  return (
    <nav className={cn('flex flex-col h-full bg-background', className)}>
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Navigation</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1 p-2">
          {NAVIGATION.map((item) => (
            <Button
              key={item.href}
              variant={isActive(item.href) ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 h-11',
                !isActive(item.href) && 'text-muted-foreground'
              )}
              asChild
            >
              <Link
                href={item.href}
                onClick={onLinkClick}
                aria-current={isActive(item.href) ? 'page' : undefined}
                title={item.description}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground">
          Claims App v1.0
        </div>
      </div>
    </nav>
  )
}