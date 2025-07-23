"use client"

import * as React from "react"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

export interface CustomSidebarContextType {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const CustomSidebarContext = React.createContext<CustomSidebarContextType | null>(null)

export function useCustomSidebar() {
  const context = React.useContext(CustomSidebarContext)
  if (!context) {
    throw new Error("useCustomSidebar must be used within a CustomSidebarProvider.")
  }
  return context
}

// Custom mobile detection hook
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)")
    const onChange = () => setIsMobile(window.innerWidth < 768)
    
    setIsMobile(window.innerWidth < 768)
    mql.addEventListener("change", onChange)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

interface CustomSidebarProviderProps {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function CustomSidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  children,
}: CustomSidebarProviderProps) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // Internal state for desktop sidebar
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // Save state to cookie for persistence
      if (typeof document !== "undefined") {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      }
    },
    [setOpenProp, open]
  )

  // Toggle function that handles both desktop and mobile
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Keyboard shortcut handling
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  // Load saved state from cookie on mount
  React.useEffect(() => {
    if (typeof document !== "undefined" && !openProp) {
      const cookies = document.cookie.split("; ")
      const sidebarCookie = cookies.find((cookie) =>
        cookie.startsWith(`${SIDEBAR_COOKIE_NAME}=`)
      )
      if (sidebarCookie) {
        const savedState = sidebarCookie.split("=")[1] === "true"
        _setOpen(savedState)
      }
    }
  }, [openProp])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<CustomSidebarContextType>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <CustomSidebarContext.Provider value={contextValue}>
      {children}
    </CustomSidebarContext.Provider>
  )
}