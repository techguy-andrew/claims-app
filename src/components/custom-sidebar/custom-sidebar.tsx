"use client"

import * as React from "react"
import { useCustomSidebar } from "./custom-sidebar-context"
import { cn } from "@/lib/utils"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"

interface CustomSidebarProps {
  children: React.ReactNode
  className?: string
}

export function CustomSidebar({ children, className }: CustomSidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useCustomSidebar()

  // Mobile sidebar with overlay
  if (isMobile) {
    return (
      <>
        {/* Backdrop overlay */}
        {openMobile && (
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
            onClick={() => setOpenMobile(false)}
            aria-hidden="true"
          />
        )}
        
        {/* Mobile sidebar drawer */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex flex-col bg-white transition-transform duration-300 ease-in-out",
            openMobile ? "translate-x-0" : "-translate-x-full",
            className
          )}
          style={{ width: SIDEBAR_WIDTH_MOBILE }}
          role="dialog"
          aria-modal="true"
          aria-label="Sidebar"
        >
          {children}
        </div>
      </>
    )
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "hidden md:flex flex-col bg-white border-r transition-all duration-200 ease-in-out",
        state === "expanded" ? "w-64" : "w-0 overflow-hidden",
        className
      )}
      style={{
        width: state === "expanded" ? SIDEBAR_WIDTH : "0rem",
      }}
    >
      {state === "expanded" && children}
    </div>
  )
}

// Sidebar layout components
interface SidebarComponentProps {
  children: React.ReactNode
  className?: string
}

export function CustomSidebarHeader({ children, className }: SidebarComponentProps) {
  return (
    <div className={cn("flex flex-col gap-2 p-2", className)}>
      {children}
    </div>
  )
}

export function CustomSidebarContent({ children, className }: SidebarComponentProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto", className)}>
      {children}
    </div>
  )
}

export function CustomSidebarFooter({ children, className }: SidebarComponentProps) {
  return (
    <div className={cn("flex flex-col gap-2 p-2", className)}>
      {children}
    </div>
  )
}

// Navigation components
export function CustomSidebarMenu({ children, className }: SidebarComponentProps) {
  return (
    <ul className={cn("flex w-full min-w-0 flex-col gap-1", className)}>
      {children}
    </ul>
  )
}

export function CustomSidebarMenuItem({ children, className }: SidebarComponentProps) {
  return (
    <li className={cn("group/menu-item relative", className)}>
      {children}
    </li>
  )
}

interface CustomSidebarMenuButtonProps {
  children: React.ReactNode
  className?: string
  isActive?: boolean
  asChild?: boolean
  onClick?: () => void
}

export function CustomSidebarMenuButton({ 
  children, 
  className, 
  isActive = false, 
  asChild = false,
  onClick,
  ...props 
}: CustomSidebarMenuButtonProps) {
  const baseClassName = cn(
    "flex w-full items-center gap-2 rounded-md p-2 text-left text-sm transition-colors",
    "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
    "disabled:pointer-events-none disabled:opacity-50",
    isActive && "bg-gray-100 font-medium text-blue-600",
    className
  )

  if (asChild) {
    return (
      <div className={baseClassName}>
        {children}
      </div>
    )
  }
  
  return (
    <button
      className={baseClassName}
      onClick={onClick}
      {...(props as React.ComponentProps<"button">)}
    >
      {children}
    </button>
  )
}

export function CustomSidebarGroup({ children, className }: SidebarComponentProps) {
  return (
    <div className={cn("relative flex w-full min-w-0 flex-col p-2", className)}>
      {children}
    </div>
  )
}

export function CustomSidebarGroupContent({ children, className }: SidebarComponentProps) {
  return (
    <div className={cn("w-full text-sm", className)}>
      {children}
    </div>
  )
}