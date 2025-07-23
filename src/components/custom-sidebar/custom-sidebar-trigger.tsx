"use client"

import * as React from "react"
import { useCustomSidebar } from "./custom-sidebar-context"
import { cn } from "@/lib/utils"

interface CustomSidebarTriggerProps {
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export function CustomSidebarTrigger({ 
  className, 
  onClick,
  ...props 
}: CustomSidebarTriggerProps & React.ComponentProps<"button">) {
  const { toggleSidebar } = useCustomSidebar()

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 text-sm font-medium",
        "transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
        "disabled:pointer-events-none disabled:opacity-50",
        "h-7 w-7", // size-7 equivalent
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      aria-label="Toggle Sidebar"
      {...props}
    >
      {/* Hamburger icon - three horizontal lines */}
      <span aria-hidden="true" className="flex flex-col justify-center items-center w-5 h-5">
        <span className="block w-5 h-0.5 bg-current mb-1 rounded"></span>
        <span className="block w-5 h-0.5 bg-current mb-1 rounded"></span>
        <span className="block w-5 h-0.5 bg-current rounded"></span>
      </span>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
}