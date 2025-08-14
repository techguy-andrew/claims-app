'use client'

import React, { useState, useCallback, useRef, useId } from 'react'
import { useIsomorphicLayoutEffect } from '../core/useIsomorphicLayoutEffect'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { 
  Home, 
  Settings, 
  User, 
  ChevronDown, 
  ChevronRight,
  LogOut,
  X,
  Package2,
  Menu,
  FileText,
  FolderOpen,
  Bell,
  Search
} from 'lucide-react'
import styles from './Sidebar.module.css'

// ============================================================================
// TYPES & INTERFACES - Advanced TypeScript 5 patterns
// ============================================================================

export interface NavigationItem {
  id: string
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  children?: NavigationItem[]
  isExternal?: boolean
  disabled?: boolean
  onClick?: () => void
}

export interface SidebarProps {
  items?: NavigationItem[]
  isOpen?: boolean
  onToggle?: () => void
  onClose?: () => void
  variant?: 'overlay' | 'push' | 'static'
  size?: 'sm' | 'md' | 'lg' 
  theme?: 'light' | 'dark' | 'auto'
  showLogo?: boolean
  logo?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
  onNavigate?: (item: NavigationItem) => void
}

interface SidebarItemProps {
  item: NavigationItem
  level?: number
  isActive?: boolean
  isExpanded?: boolean
  onToggle?: (id: string) => void
  onNavigate?: (item: NavigationItem) => void
}

// ============================================================================
// DEFAULT NAVIGATION ITEMS
// ============================================================================

const defaultNavigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    href: '/',
    icon: Home
  },
  {
    id: 'claims',
    label: 'Claims',
    icon: FileText,
    children: [
      {
        id: 'all-claims',
        label: 'All Claims',
        href: '/claims'
      },
      {
        id: 'new-claim',
        label: 'New Claim',
        href: '/claims/new'
      }
    ]
  },
  {
    id: 'files',
    label: 'Files',
    href: '/files',
    icon: FolderOpen
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings
  }
]

// ============================================================================
// SIDEBAR ITEM COMPONENT - Recursive navigation with animations
// ============================================================================

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  level = 0,
  isActive = false,
  isExpanded = false,
  onToggle,
  onNavigate
}) => {
  const hasChildren = item.children && item.children.length > 0
  const pathname = usePathname()
  
  // Check if this item or any of its children are active
  const checkIsActive = useCallback((item: NavigationItem): boolean => {
    if (item.href && pathname === item.href) return true
    if (item.children) {
      return item.children.some(child => checkIsActive(child))
    }
    return false
  }, [pathname])

  const isItemActive = checkIsActive(item)
  const isChildActive = item.children?.some(child => checkIsActive(child))

  const handleClick = useCallback(() => {
    if (item.disabled) return
    
    if (hasChildren) {
      onToggle?.(item.id)
    } else {
      onNavigate?.(item)
      if (item.onClick) {
        item.onClick()
      }
    }
  }, [item, hasChildren, onToggle, onNavigate])

  // Animation variants for smooth transitions
  const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { x: 2, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
  }

  const childrenVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: 'auto', opacity: 1 }
  }

  // Calculate indentation based on level
  const paddingLeft = 12 + (level * 16)

  const ItemContent = (
    <motion.div
      variants={itemVariants}
      initial="initial"
      animate="animate"
      whileHover={!item.disabled ? "hover" : undefined}
      whileTap={!item.disabled ? "tap" : undefined}
      className={`${styles.sidebarItem} ${
        isItemActive ? styles.active : ''
      } ${
        isChildActive ? styles.childActive : ''
      } ${
        item.disabled ? styles.disabled : ''
      }`}
      style={{ paddingLeft }}
      onClick={handleClick}
      role={hasChildren ? 'button' : 'menuitem'}
      tabIndex={item.disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !item.disabled) {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {/* Icon */}
      {item.icon && (
        <div className={styles.itemIcon}>
          <item.icon className={styles.iconSvg} />
        </div>
      )}

      {/* Label */}
      <span className={styles.itemLabel}>
        {item.label}
      </span>

      {/* Badge */}
      {item.badge && (
        <span className={styles.itemBadge}>
          {item.badge}
        </span>
      )}

      {/* Chevron for expandable items */}
      {hasChildren && (
        <motion.div
          className={styles.itemChevron}
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className={styles.chevronIcon} />
        </motion.div>
      )}
    </motion.div>
  )

  return (
    <div className={styles.sidebarItemContainer}>
      {item.href && !hasChildren ? (
        <Link href={item.href} className={styles.sidebarLink}>
          {ItemContent}
        </Link>
      ) : (
        ItemContent
      )}

      {/* Children with smooth animations */}
      {hasChildren && (
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              variants={childrenVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className={styles.sidebarChildren}
            >
              {item.children!.map((child) => (
                <SidebarItem
                  key={child.id}
                  item={child}
                  level={level + 1}
                  isExpanded={false} // Children don't expand by default
                  onToggle={onToggle}
                  onNavigate={onNavigate}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

// ============================================================================
// MAIN SIDEBAR COMPONENT - Glass morphism with advanced features
// ============================================================================

export const Sidebar: React.FC<SidebarProps> = ({
  items = defaultNavigationItems,
  isOpen = false,
  onToggle,
  onClose,
  variant = 'overlay',
  size = 'md',
  theme = 'light',
  showLogo = true,
  logo,
  footer,
  className,
  collapsible = false,
  defaultCollapsed = false,
  onNavigate
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const sidebarId = useId()

  // Motion values for advanced animations
  const x = useMotionValue(isOpen ? 0 : -100)
  const opacity = useTransform(x, [-100, 0], [0, 1])

  // Handle item expansion
  const handleToggleItem = useCallback((id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  // Handle navigation
  const handleNavigate = useCallback((item: NavigationItem) => {
    onNavigate?.(item)
    if (variant === 'overlay') {
      onClose?.()
    }
  }, [onNavigate, onClose, variant])

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose?.()
    }
  }, [onClose])

  // Handle escape key
  useIsomorphicLayoutEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Focus management
  useIsomorphicLayoutEffect(() => {
    if (isOpen && sidebarRef.current) {
      const firstFocusable = sidebarRef.current.querySelector('[tabindex="0"]') as HTMLElement
      firstFocusable?.focus()
    }
  }, [isOpen])

  // Sidebar variants for different display modes
  const sidebarVariants = {
    overlay: {
      initial: { x: '-100%', opacity: 0 },
      animate: { x: '0%', opacity: 1 },
      exit: { x: '-100%', opacity: 0 }
    },
    push: {
      initial: { x: '0%' },
      animate: { x: '0%' },
      exit: { x: '0%' }
    },
    static: {
      initial: { x: '0%' },
      animate: { x: '0%' },
      exit: { x: '0%' }
    }
  }

  // Container classes
  const sidebarClasses = [
    styles.sidebar,
    styles[variant],
    styles[size],
    styles[theme],
    isCollapsed && styles.collapsed,
    className
  ].filter(Boolean).join(' ')

  const overlayClasses = [
    styles.overlay,
    variant === 'overlay' && styles.overlayVisible
  ].filter(Boolean).join(' ')

  // Main sidebar content
  const SidebarContent = (
    <motion.aside
      ref={sidebarRef}
      className={sidebarClasses}
      variants={sidebarVariants[variant]}
      initial="initial"
      animate={isOpen ? "animate" : "initial"}
      exit="exit"
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      role="navigation"
      aria-label="Main navigation"
      aria-expanded={isOpen}
      id={sidebarId}
    >
      {/* Header with logo and controls */}
      <div className={styles.sidebarHeader}>
        {showLogo && (
          <div className={styles.sidebarLogo}>
            {logo || (
              <div className={styles.defaultLogo}>
                <Package2 className={styles.logoIcon} />
                {!isCollapsed && (
                  <span className={styles.logoText}>ClaimsApp</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Close button for mobile */}
        {variant === 'overlay' && (
          <motion.button
            className={styles.closeButton}
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Close sidebar"
          >
            <X className={styles.closeIcon} />
          </motion.button>
        )}

        {/* Collapse toggle for collapsible sidebar */}
        {collapsible && (
          <motion.button
            className={styles.collapseButton}
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight
              className={`${styles.collapseIcon} ${isCollapsed ? styles.collapsed : ''}`}
            />
          </motion.button>
        )}
      </div>

      {/* Navigation items */}
      <nav className={styles.sidebarNav}>
        <motion.div
          className={styles.navItems}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isExpanded={expandedItems.has(item.id)}
              onToggle={handleToggleItem}
              onNavigate={handleNavigate}
            />
          ))}
        </motion.div>
      </nav>

      {/* Footer */}
      {footer && (
        <div className={styles.sidebarFooter}>
          {footer}
        </div>
      )}
    </motion.aside>
  )

  // Render based on variant
  if (variant === 'static') {
    return SidebarContent
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && variant === 'overlay' && (
          <motion.div
            ref={overlayRef}
            className={overlayClasses}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isOpen || variant !== 'overlay') && SidebarContent}
      </AnimatePresence>
    </>
  )
}

export default Sidebar