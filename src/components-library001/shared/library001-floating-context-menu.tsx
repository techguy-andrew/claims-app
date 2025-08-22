'use client'

import React, { useState, useCallback, useRef, useLayoutEffect } from 'react'
import { MoreVertical } from 'lucide-react'

// Types
export interface Library001MenuAction {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
}

interface Library001FloatingContextMenuProps {
  actions: Library001MenuAction[]
  disabled?: boolean
  loading?: boolean
  className?: string
  buttonTitle?: string
}

export function Library001FloatingContextMenu({ 
  actions, 
  disabled = false, 
  loading = false, 
  className = "",
  buttonTitle = "More actions"
}: Library001FloatingContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Toggle floating menu and calculate position
  const toggleMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    
    if (isOpen) {
      setIsOpen(false)
      setMenuPosition(null)
      return
    }

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const menuWidth = 160
    const menuHeight = actions.length * 44 + 8 // Approximate height per item + padding
    
    let top = rect.bottom + 8
    let right = window.innerWidth - rect.right
    
    // Flip vertically if too close to bottom
    if (top + menuHeight > window.innerHeight - 20) {
      top = rect.top - menuHeight - 8
    }
    
    // Flip horizontally if too close to left edge
    if (right + menuWidth > window.innerWidth - 20) {
      right = 20
    }
    
    setMenuPosition({ top, right })
    setIsOpen(true)
  }, [isOpen, actions.length])

  // Handle action selection
  const handleAction = useCallback((action: Library001MenuAction, event: React.MouseEvent) => {
    event.stopPropagation()
    setIsOpen(false)
    setMenuPosition(null)
    action.onClick()
  }, [])

  // Close menu when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Element
    if (!target.closest('.floating-menu') && !target.closest('.menu-button')) {
      setIsOpen(false)
      setMenuPosition(null)
    }
  }, [])

  // Setup click outside listener
  useLayoutEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen, handleClickOutside])

  return (
    <>
      {/* Menu Button */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        disabled={disabled || loading}
        className={`menu-button w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${className}`}
        title={buttonTitle}
      >
        {loading ? (
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        ) : (
          <MoreVertical className="h-5 w-5 text-gray-600" />
        )}
      </button>

      {/* Floating Context Menu */}
      {isOpen && menuPosition && (
        <div 
          className="floating-menu fixed z-50 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-xl shadow-lg min-w-[160px] p-1 transition-all duration-200 opacity-100 scale-100"
          style={{
            top: `${menuPosition.top}px`,
            right: `${menuPosition.right}px`
          }}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={(event) => handleAction(action, event)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 text-left ${
                action.variant === 'danger' 
                  ? 'hover:bg-red-50/80 text-red-600' 
                  : 'hover:bg-gray-100/80 text-gray-900'
              }`}
            >
              <span className={`h-4 w-4 ${action.variant === 'danger' ? 'text-red-500' : 'text-gray-600'}`}>
                {action.icon}
              </span>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}

// Default export for convenience
export default Library001FloatingContextMenu