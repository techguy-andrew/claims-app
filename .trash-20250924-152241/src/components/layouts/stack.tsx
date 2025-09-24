import { cn } from "@/lib/utils"

interface StackProps {
  children: React.ReactNode
  spacing?: 2 | 3 | 4 | 6 | 8 | 10 | 12 | 16
  className?: string
  direction?: "vertical" | "horizontal"
}

export function Stack({ 
  children, 
  spacing = 8,
  direction = "vertical",
  className 
}: StackProps) {
  const spacingMap = {
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
    10: "gap-10",
    12: "gap-12",
    16: "gap-16"
  }

  return (
    <div className={cn(
      "flex w-full",
      direction === "vertical" ? "flex-col" : "flex-row",
      spacingMap[spacing],
      className
    )}>
      {children}
    </div>
  )
}