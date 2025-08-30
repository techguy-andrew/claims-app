import { cn } from "@/lib/utils"

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  spacing?: "tight" | "normal" | "relaxed"
}

export function PageLayout({ 
  children, 
  className,
  spacing = "normal" 
}: PageLayoutProps) {
  const spacingMap = {
    tight: "gap-12 md:gap-16 lg:gap-20",
    normal: "gap-16 md:gap-20 lg:gap-24", 
    relaxed: "gap-20 md:gap-28 lg:gap-32"
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className={cn(
        "flex-1 flex flex-col",
        "w-full mx-auto",
        "px-4 sm:px-6 lg:px-8",
        "py-12 md:py-16 lg:py-20",
        spacingMap[spacing],
        className
      )}>
        {children}
      </div>
    </main>
  )
}