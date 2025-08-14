'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useIsomorphicLayoutEffect } from '../core/useIsomorphicLayoutEffect'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  ChevronDown,
  Sun,
  Moon,
  Monitor
} from 'lucide-react'
import { useNavigation } from './NavigationProvider'
import styles from './Navbar.module.css'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface NavbarUserMenuAction {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  variant?: 'default' | 'danger'
  separator?: boolean
}

export interface NavbarProps {
  showSearch?: boolean
  showNotifications?: boolean
  showUserMenu?: boolean
  showThemeToggle?: boolean
  logo?: React.ReactNode
  children?: React.ReactNode
  className?: string
  user?: {
    name: string
    email?: string
    avatar?: string
    initials?: string
  }
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  onNotificationClick?: () => void
  userMenuActions?: NavbarUserMenuAction[]
  notificationCount?: number
  fixed?: boolean
  transparent?: boolean
}

// ============================================================================
// DEFAULT USER MENU ACTIONS
// ============================================================================

const defaultUserMenuActions: NavbarUserMenuAction[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    href: '/profile'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings'
  },
  {
    id: 'divider-1',
    label: '',
    separator: true
  },
  {
    id: 'logout',
    label: 'Sign Out',
    icon: LogOut,
    variant: 'danger',
    onClick: () => {
      // Handle logout
      console.log('Logout clicked')
    }
  }
]

// ============================================================================
// SEARCH COMPONENT
// ============================================================================

const NavbarSearch: React.FC<{
  placeholder?: string
  onSearch?: (query: string) => void
}> = ({ placeholder = 'Search...', onSearch }) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }, [query, onSearch])

  return (
    <motion.form
      className={`${styles.searchForm} ${isFocused ? styles.searchFocused : ''}`}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Search className={styles.searchIcon} />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={styles.searchInput}
      />
    </motion.form>
  )
}

// ============================================================================
// NOTIFICATION BUTTON
// ============================================================================

const NotificationButton: React.FC<{
  count?: number
  onClick?: () => void
}> = ({ count, onClick }) => {
  return (
    <motion.button
      className={styles.notificationButton}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Notifications${count ? ` (${count})` : ''}`}
    >
      <Bell className={styles.notificationIcon} />
      {count && count > 0 && (
        <motion.span
          className={styles.notificationBadge}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </motion.button>
  )
}

// ============================================================================
// THEME TOGGLE
// ============================================================================

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light')

  const themeIcons = {
    light: Sun,
    dark: Moon,
    auto: Monitor
  }

  const themeLabels = {
    light: 'Light theme',
    dark: 'Dark theme',
    auto: 'System theme'
  }

  const cycleTheme = useCallback(() => {
    const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }, [theme])

  const ThemeIcon = themeIcons[theme]

  return (
    <motion.button
      className={styles.themeToggle}
      onClick={cycleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={themeLabels[theme]}
      title={themeLabels[theme]}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <ThemeIcon className={styles.themeIcon} />
      </motion.div>
    </motion.button>
  )
}

// ============================================================================
// USER MENU
// ============================================================================

const UserMenu: React.FC<{
  user?: NavbarProps['user']
  actions?: NavbarUserMenuAction[]
}> = ({ user, actions = defaultUserMenuActions }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = useCallback(() => setIsOpen(!isOpen), [isOpen])
  const closeMenu = useCallback(() => setIsOpen(false), [])

  // Close menu when clicking outside
  useIsomorphicLayoutEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, closeMenu])

  const handleAction = useCallback((action: NavbarUserMenuAction) => {
    if (action.onClick) {
      action.onClick()
    }
    closeMenu()
  }, [closeMenu])

  // Generate user initials
  const userInitials = user?.initials || user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  return (
    <div className={styles.userMenuContainer} ref={menuRef}>
      <motion.button
        className={styles.userMenuButton}
        onClick={toggleMenu}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className={styles.userAvatar}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className={styles.avatarImage} />
          ) : (
            <span className={styles.avatarInitials}>{userInitials}</span>
          )}
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user?.name || 'User'}</span>
          {user?.email && (
            <span className={styles.userEmail}>{user.email}</span>
          )}
        </div>
        <motion.div
          className={styles.userMenuChevron}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className={styles.chevronIcon} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.userMenuDropdown}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            role="menu"
          >
            {actions.map((action) => {
              if (action.separator) {
                return <div key={action.id} className={styles.menuSeparator} />
              }

              const ActionContent = (
                <motion.div
                  className={`${styles.menuAction} ${
                    action.variant === 'danger' ? styles.menuActionDanger : ''
                  }`}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.1 }}
                  onClick={() => handleAction(action)}
                  role="menuitem"
                >
                  {action.icon && (
                    <action.icon className={styles.menuActionIcon} />
                  )}
                  <span className={styles.menuActionLabel}>{action.label}</span>
                </motion.div>
              )

              return action.href ? (
                <Link key={action.id} href={action.href} className={styles.menuActionLink}>
                  {ActionContent}
                </Link>
              ) : (
                <button key={action.id} className={styles.menuActionButton}>
                  {ActionContent}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// MAIN NAVBAR COMPONENT
// ============================================================================

export const Navbar: React.FC<NavbarProps> = ({
  showSearch = true,
  showNotifications = true,
  showUserMenu = true,
  showThemeToggle = true,
  logo,
  children,
  className,
  user,
  searchPlaceholder,
  onSearch,
  onNotificationClick,
  userMenuActions,
  notificationCount,
  fixed = false,
  transparent = false
}) => {
  const navigation = useNavigation()

  const navbarClasses = [
    styles.navbar,
    fixed && styles.navbarFixed,
    transparent && styles.navbarTransparent,
    className
  ].filter(Boolean).join(' ')

  return (
    <motion.nav
      className={navbarClasses}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.navbarContent}>
        {/* Left Section */}
        <div className={styles.navbarLeft}>
          {/* Mobile Menu Button */}
          <motion.button
            className={styles.mobileMenuButton}
            onClick={navigation.actions.toggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle navigation menu"
          >
            <Menu className={styles.mobileMenuIcon} />
          </motion.button>

          {/* Logo */}
          {logo && (
            <div className={styles.navbarLogo}>
              {logo}
            </div>
          )}

          {/* Children (additional left content) */}
          {children && (
            <div className={styles.navbarChildren}>
              {children}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className={styles.navbarRight}>
          {/* Search */}
          {showSearch && (
            <NavbarSearch
              placeholder={searchPlaceholder}
              onSearch={onSearch}
            />
          )}

          {/* Theme Toggle */}
          {showThemeToggle && <ThemeToggle />}

          {/* Notifications */}
          {showNotifications && (
            <NotificationButton
              count={notificationCount}
              onClick={onNotificationClick}
            />
          )}

          {/* User Menu */}
          {showUserMenu && (
            <UserMenu
              user={user}
              actions={userMenuActions}
            />
          )}
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar