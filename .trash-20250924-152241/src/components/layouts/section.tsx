import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  width?: "full" | "wide" | "normal" | "narrow"
}

export function Section({ 
  children, 
  className,
  width = "normal"
}: SectionProps) {
  const widthMap = {
    full: "max-w-none",
    wide: "max-w-7xl",
    normal: "max-w-6xl",
    narrow: "max-w-4xl"
  }

  return (
    <section className={cn(
      "w-full",
      widthMap[width],
      className
    )}>
      {children}
    </section>
  )
}