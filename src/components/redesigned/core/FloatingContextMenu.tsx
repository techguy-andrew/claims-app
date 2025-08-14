'use client'

import React, { useState, useCallback, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { LucideIcon } from 'lucide-react'
import styles from './FloatingContextMenu.module.css'

// ============================================================================
// TYPES
// ============================================================================

export interface MenuPosition {
  top: number
  right: number
}

export interface MenuItem {
  id: string
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: 'default' | 'destructive'
  disabled?: boolean
  shortcut?: string
}

export interface FloatingContextMenuProps {
  isOpen: boolean
  position: MenuPosition | null
  items: MenuItem[]
  onClose: () => void
  className?: string
  minWidth?: number
}

// ============================================================================
// FLOATING CONTEXT MENU COMPONENT
// ============================================================================

export const FloatingContextMenu: React.FC<FloatingContextMenuProps> = ({
  isOpen,
  position,
  items,
  onClose,
  className = '',
  minWidth = 160
}) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Ensure we're mounted (for SSR compatibility)
  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  // Handle clicks outside the menu
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Element
    if (!target.closest(`.${styles.floatingMenu}`) && !target.closest('.menu-button')) {
      onClose()
    }
  }, [onClose])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return

    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        onClose()
        break
      case 'ArrowDown':
        event.preventDefault()
        // Focus next menu item
        // Implementation for keyboard navigation
        break
      case 'ArrowUp':
        event.preventDefault()
        // Focus previous menu item
        // Implementation for keyboard navigation
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        // Trigger focused menu item
        // Implementation for keyboard activation
        break
    }
  }, [isOpen, onClose])

  // Setup event listeners
  useLayoutEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, handleClickOutside, handleKeyDown])

  // Handle menu item click
  const handleItemClick = useCallback((item: MenuItem) => {
    if (item.disabled) return
    item.onClick()
    onClose()
  }, [onClose])

  // Don't render if not mounted (SSR compatibility) or not open
  if (!mounted || !isOpen || !position) return null

  const menuStyle = {
    top: `${position.top}px`,
    right: `${position.right}px`,
    minWidth: `${minWidth}px`
  }

  const combinedClassName = [
    styles.floatingMenu,
    className
  ].filter(Boolean).join(' ')

  return createPortal(
    <div
      ref={menuRef}
      className={combinedClassName}
      style={menuStyle}
      role="menu"
      aria-orientation="vertical"
    >
      {items.map((item, index) => {
        const Icon = item.icon
        const itemClassName = [
          styles.menuItem,
          item.variant === 'destructive' ? styles.destructive : '',
          item.disabled ? styles.disabled : ''
        ].filter(Boolean).join(' ')

        return (
          <button
            key={item.id}
            className={itemClassName}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
            role="menuitem"
            tabIndex={-1}
          >
            {Icon && (
              <Icon className={styles.menuIcon} size={16} />
            )}
            <span className={styles.menuLabel}>{item.label}</span>
            {item.shortcut && (
              <span className={styles.menuShortcut}>{item.shortcut}</span>
            )}
          </button>
        )
      })}
    </div>,
    document.body
  )
}

// ============================================================================
// HOOK FOR MENU POSITIONING
// ============================================================================

export interface UseFloatingMenuOptions {
  menuWidth?: number
  menuHeight?: number
  offset?: number
}

export const useFloatingMenu = (options: UseFloatingMenuOptions = {}) => {
  const {
    menuWidth = 160,
    menuHeight = 100,
    offset = 8
  } = options

  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<MenuPosition | null>(null)

  const calculatePosition = useCallback((
    triggerElement: HTMLElement
  ): MenuPosition => {
    const rect = triggerElement.getBoundingClientRect()
    
    let top = rect.bottom + offset
    let right = window.innerWidth - rect.right
    
    // Flip vertically if too close to bottom
    if (top + menuHeight > window.innerHeight - 20) {
      top = rect.top - menuHeight - offset
    }
    
    // Flip horizontally if too close to left edge
    if (right + menuWidth > window.innerWidth - 20) {
      right = 20
    }
    
    return { top, right }
  }, [menuWidth, menuHeight, offset])

  const openMenu = useCallback((triggerElement: HTMLElement) => {
    const newPosition = calculatePosition(triggerElement)
    setPosition(newPosition)
    setIsOpen(true)
  }, [calculatePosition])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    setPosition(null)
  }, [])

  const toggleMenu = useCallback((triggerElement: HTMLElement) => {
    if (isOpen) {
      closeMenu()
    } else {
      openMenu(triggerElement)
    }
  }, [isOpen, openMenu, closeMenu])

  return {
    isOpen,
    position,
    openMenu,
    closeMenu,
    toggleMenu
  }
}

// ============================================================================
// CONTEXT PROVIDER FOR GLOBAL MENU STATE
// ============================================================================

interface MenuContextType {
  activeMenuId: string | null
  setActiveMenuId: (id: string | null) => void
}

const MenuContext = React.createContext<MenuContextType | null>(null)

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  return (
    <MenuContext.Provider value={{ activeMenuId, setActiveMenuId }}>
      {children}
    </MenuContext.Provider>
  )
}

export const useMenuContext = () => {
  const context = React.useContext(MenuContext)
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider')
  }
  return context
}

// ============================================================================
// MENU TRIGGER COMPONENT
// ============================================================================

export interface MenuTriggerProps {
  menuId: string
  items: MenuItem[]
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export const MenuTrigger: React.FC<MenuTriggerProps> = ({
  menuId,
  items,
  children,
  className = '',
  disabled = false
}) => {
  const { activeMenuId, setActiveMenuId } = useMenuContext()
  const { isOpen, position, toggleMenu, closeMenu } = useFloatingMenu()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const isThisMenuOpen = activeMenuId === menuId

  const handleTriggerClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (disabled) return

    if (triggerRef.current) {
      if (isThisMenuOpen) {
        setActiveMenuId(null)
      } else {
        setActiveMenuId(menuId)
        toggleMenu(triggerRef.current)
      }
    }
  }, [disabled, isThisMenuOpen, menuId, setActiveMenuId, toggleMenu])

  const handleClose = useCallback(() => {
    setActiveMenuId(null)
    closeMenu()
  }, [setActiveMenuId, closeMenu])

  // Close menu when another menu becomes active
  useLayoutEffect(() => {
    if (activeMenuId !== menuId && isOpen) {
      closeMenu()
    }
  }, [activeMenuId, menuId, isOpen, closeMenu])

  return (
    <>
      <button
        ref={triggerRef}
        className={`menu-button ${className}`}
        onClick={handleTriggerClick}
        disabled={disabled}
        aria-expanded={isThisMenuOpen}
        aria-haspopup="menu"
      >
        {children}
      </button>
      
      <FloatingContextMenu
        isOpen={isThisMenuOpen && isOpen}
        position={position}
        items={items}
        onClose={handleClose}
      />
    </>
  )
}