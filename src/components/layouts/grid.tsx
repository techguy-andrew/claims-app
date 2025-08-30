import { cn } from "@/lib/utils"

interface GridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function Grid({ 
  children, 
  columns = 3,
  className 
}: GridProps) {
  const columnMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }

  return (
    <div className={cn(
      "grid w-full gap-6 md:gap-8",
      columnMap[columns],
      className
    )}>
      {children}
    </div>
  )
}