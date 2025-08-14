'use client'

import React, { useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ChevronRight, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Menu,
  Plus,
  Download,
  Share,
  RefreshCw
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../forms/Input'
import styles from './Topbar.module.css'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  current?: boolean
}

export interface TopbarAction {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  onClick?: () => void
  href?: string
  disabled?: boolean
  loading?: boolean
  shortcut?: string
}

export interface TopbarProps {
  title?: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: TopbarAction[]
  searchPlaceholder?: string
  showSearch?: boolean
  onSearch?: (query: string) => void
  showMenuButton?: boolean
  onMenuToggle?: () => void
  className?: string
  children?: React.ReactNode
  loading?: boolean
  compact?: boolean
}

// ============================================================================
// DEFAULT ACTIONS
// ============================================================================

const defaultActions: TopbarAction[] = [
  {
    id: 'refresh',
    label: 'Refresh',
    icon: RefreshCw,
    variant: 'ghost',
    shortcut: '⌘R'
  },
  {
    id: 'export',
    label: 'Export',
    icon: Download,
    variant: 'outline'
  },
  {
    id: 'add',
    label: 'Add New',
    icon: Plus,
    variant: 'primary'
  }
]

// ============================================================================
// BREADCRUMB COMPONENT
// ============================================================================

const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => (
          <li key={index} className={styles.breadcrumbItem}>
            {item.href && !item.current ? (
              <Link href={item.href} className={styles.breadcrumbLink}>
                {item.icon && (
                  <item.icon className={styles.breadcrumbIcon} />
                )}
                <span className={styles.breadcrumbLabel}>{item.label}</span>
              </Link>
            ) : (
              <span className={`${styles.breadcrumbCurrent} ${item.current ? styles.current : ''}`}>
                {item.icon && (
                  <item.icon className={styles.breadcrumbIcon} />
                )}
                <span className={styles.breadcrumbLabel}>{item.label}</span>
              </span>
            )}
            {index < items.length - 1 && (
              <ChevronRight className={styles.breadcrumbSeparator} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// ============================================================================
// SEARCH COMPONENT
// ============================================================================

const TopbarSearch: React.FC<{
  placeholder?: string
  onSearch?: (query: string) => void
}> = ({ placeholder = 'Search...', onSearch }) => {
  const [query, setQuery] = React.useState('')

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }, [query, onSearch])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        leftIcon={<Search />}
        className={styles.searchInput}
        size="default"
        variant="outline"
      />
    </form>
  )
}

// ============================================================================
// ACTION BUTTONS
// ============================================================================

const TopbarActions: React.FC<{ actions: TopbarAction[] }> = ({ actions }) => {
  return (
    <div className={styles.actions}>
      {actions.map((action) => {
        const ActionButton = (
          <Button
            key={action.id}
            variant={action.variant || 'secondary'}
            size="default"
            disabled={action.disabled}
            loading={action.loading}
            onClick={action.onClick}
            leftIcon={action.icon}
            title={action.shortcut ? `${action.label} (${action.shortcut})` : action.label}
            className={styles.actionButton}
          >
            <span className={styles.actionLabel}>{action.label}</span>
            {action.shortcut && (
              <span className={styles.actionShortcut}>{action.shortcut}</span>
            )}
          </Button>
        )

        return action.href ? (
          <Link key={action.id} href={action.href}>
            {ActionButton}
          </Link>
        ) : (
          ActionButton
        )
      })}
    </div>
  )
}

// ============================================================================
// MAIN TOPBAR COMPONENT
// ============================================================================

export const Topbar: React.FC<TopbarProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions = [],
  searchPlaceholder,
  showSearch = false,
  onSearch,
  showMenuButton = false,
  onMenuToggle,
  className,
  children,
  loading = false,
  compact = false
}) => {
  const topbarClasses = [
    styles.topbar,
    compact && styles.topbarCompact,
    loading && styles.topbarLoading,
    className
  ].filter(Boolean).join(' ')

  return (
    <motion.header
      className={topbarClasses}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.topbarContent}>
        {/* Left Section */}
        <div className={styles.topbarLeft}>
          {/* Mobile Menu Button */}
          {showMenuButton && (
            <motion.button
              className={styles.menuButton}
              onClick={onMenuToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              <Menu className={styles.menuIcon} />
            </motion.button>
          )}

          {/* Title Section */}
          <div className={styles.titleSection}>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb items={breadcrumbs} />
            )}
            
            {title && (
              <div className={styles.titleContainer}>
                <motion.h1 
                  className={styles.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {title}
                </motion.h1>
                {subtitle && (
                  <motion.p 
                    className={styles.subtitle}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {subtitle}
                  </motion.p>
                )}
              </div>
            )}
          </div>

          {/* Custom children */}
          {children && (
            <div className={styles.topbarChildren}>
              {children}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className={styles.topbarRight}>
          {/* Search */}
          {showSearch && (
            <TopbarSearch
              placeholder={searchPlaceholder}
              onSearch={onSearch}
            />
          )}

          {/* Actions */}
          {actions.length > 0 && <TopbarActions actions={actions} />}

          {/* Loading indicator */}
          {loading && (
            <motion.div
              className={styles.loadingIndicator}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <RefreshCw className={styles.loadingIcon} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom border with subtle animation */}
      <motion.div
        className={styles.topbarBorder}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
    </motion.header>
  )
}

export default Topbar