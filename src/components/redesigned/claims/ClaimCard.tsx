'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  ChevronRight, 
  Calendar,
  DollarSign,
  Building,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react'
import { FloatingContextMenu } from '../core/FloatingContextMenu'
import styles from './ClaimCard.module.css'

// ============================================================================
// TYPES & INTERFACES - Advanced TypeScript 5 patterns
// ============================================================================

export type ClaimStatus = 
  | 'OPEN'
  | 'IN_PROGRESS' 
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'DENIED'
  | 'CLOSED'

export interface Claim {
  id: string
  claimNumber: string
  clientName: string
  insuranceCompany: string
  status: ClaimStatus
  amount?: number
  dateCreated: string
  dateUpdated: string
  description?: string
  itemsCount?: number
  filesCount?: number
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  assignedTo?: string
}

export interface ClaimCardAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick: (claim: Claim) => void
  variant?: 'default' | 'primary' | 'danger'
  disabled?: boolean
}

export interface ClaimCardProps {
  claim: Claim
  actions?: ClaimCardAction[]
  onClick?: (claim: Claim) => void
  href?: string
  loading?: boolean
  compact?: boolean
  showActions?: boolean
  className?: string
  animated?: boolean
}

// ============================================================================
// CONSTANTS & CONFIGURATIONS
// ============================================================================

const statusConfig: Record<ClaimStatus, {
  label: string
  color: string
  background: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
}> = {
  OPEN: {
    label: 'Open',
    color: 'text-blue-700',
    background: 'bg-blue-50',
    icon: FileText,
    gradient: 'from-blue-400 to-blue-500'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-amber-700',
    background: 'bg-amber-50', 
    icon: Clock,
    gradient: 'from-amber-400 to-orange-500'
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'text-purple-700',
    background: 'bg-purple-50',
    icon: Eye,
    gradient: 'from-purple-400 to-purple-500'
  },
  APPROVED: {
    label: 'Approved',
    color: 'text-green-700',
    background: 'bg-green-50',
    icon: CheckCircle,
    gradient: 'from-green-400 to-emerald-500'
  },
  DENIED: {
    label: 'Denied',
    color: 'text-red-700',
    background: 'bg-red-50',
    icon: XCircle,
    gradient: 'from-red-400 to-red-500'
  },
  CLOSED: {
    label: 'Closed',
    color: 'text-gray-700',
    background: 'bg-gray-50',
    icon: CheckCircle,
    gradient: 'from-gray-400 to-gray-500'
  }
}

const priorityConfig = {
  LOW: { label: 'Low', color: 'text-gray-600', background: 'bg-gray-100' },
  MEDIUM: { label: 'Medium', color: 'text-blue-600', background: 'bg-blue-100' },
  HIGH: { label: 'High', color: 'text-orange-600', background: 'bg-orange-100' },
  URGENT: { label: 'Urgent', color: 'text-red-600', background: 'bg-red-100' }
}

const defaultActions: ClaimCardAction[] = [
  {
    id: 'view',
    label: 'View Details',
    icon: Eye,
    onClick: (claim) => console.log('View claim:', claim.id)
  },
  {
    id: 'edit',
    label: 'Edit Claim',
    icon: Edit,
    onClick: (claim) => console.log('Edit claim:', claim.id)
  }
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateString))
}

const getTimeAgo = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString)
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
  return `${Math.ceil(diffDays / 30)} months ago`
}

// ============================================================================
// STATUS BADGE COMPONENT
// ============================================================================

const StatusBadge: React.FC<{ status: ClaimStatus; compact?: boolean }> = ({ 
  status, 
  compact = false 
}) => {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <div className={`${styles.statusBadge} ${styles[`status${status}`]}`}>
      <StatusIcon className={styles.statusIcon} />
      {!compact && (
        <span className={styles.statusLabel}>{config.label}</span>
      )}
    </div>
  )
}

// ============================================================================
// PRIORITY BADGE COMPONENT
// ============================================================================

const PriorityBadge: React.FC<{ priority: NonNullable<Claim['priority']> }> = ({ 
  priority 
}) => {
  const config = priorityConfig[priority]

  return (
    <span className={`${styles.priorityBadge} ${styles[`priority${priority}`]}`}>
      {config.label}
    </span>
  )
}

// ============================================================================
// CLAIM STATS COMPONENT
// ============================================================================

const ClaimStats: React.FC<{ 
  itemsCount?: number
  filesCount?: number
  amount?: number
  compact?: boolean 
}> = ({ 
  itemsCount, 
  filesCount, 
  amount, 
  compact = false 
}) => {
  return (
    <div className={`${styles.claimStats} ${compact ? styles.compact : ''}`}>
      {amount && (
        <div className={styles.statItem}>
          <DollarSign className={styles.statIcon} />
          <span className={styles.statValue}>{formatCurrency(amount)}</span>
          {!compact && <span className={styles.statLabel}>Amount</span>}
        </div>
      )}
      {itemsCount !== undefined && (
        <div className={styles.statItem}>
          <FileText className={styles.statIcon} />
          <span className={styles.statValue}>{itemsCount}</span>
          {!compact && <span className={styles.statLabel}>Items</span>}
        </div>
      )}
      {filesCount !== undefined && (
        <div className={styles.statItem}>
          <User className={styles.statIcon} />
          <span className={styles.statValue}>{filesCount}</span>
          {!compact && <span className={styles.statLabel}>Files</span>}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// ACTIONS MENU COMPONENT  
// ============================================================================

const ActionsMenu: React.FC<{ 
  actions: ClaimCardAction[]
  claim: Claim
  onClose: () => void
}> = ({ actions, claim, onClose }) => {
  return (
    <div className={styles.actionsMenu}>
      {actions.map((action) => (
        <motion.button
          key={action.id}
          className={`${styles.actionItem} ${
            action.variant === 'danger' ? styles.actionDanger :
            action.variant === 'primary' ? styles.actionPrimary : ''
          }`}
          onClick={() => {
            action.onClick(claim)
            onClose()
          }}
          disabled={action.disabled}
          whileHover={{ x: 2 }}
          transition={{ duration: 0.1 }}
        >
          <action.icon className={styles.actionIcon} />
          <span className={styles.actionLabel}>{action.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

// ============================================================================
// MAIN CLAIM CARD COMPONENT
// ============================================================================

export const ClaimCard: React.FC<ClaimCardProps> = ({
  claim,
  actions = defaultActions,
  onClick,
  href,
  loading = false,
  compact = false,
  showActions = true,
  className,
  animated = true
}) => {
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null)

  const handleCardClick = useCallback(() => {
    if (loading) return
    onClick?.(claim)
  }, [claim, onClick, loading])

  const handleActionsClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const rect = event.currentTarget.getBoundingClientRect()
    
    const top = rect.bottom + 8
    const right = window.innerWidth - rect.right

    setMenuPosition({ top, right })
    setShowActionsMenu(!showActionsMenu)
  }, [showActionsMenu])

  const closeActionsMenu = useCallback(() => {
    setShowActionsMenu(false)
    setMenuPosition(null)
  }, [])

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    hover: { 
      y: -4,
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  }

  const cardClasses = [
    styles.claimCard,
    compact && styles.compact,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ')

  const CardContent = (
    <motion.div
      variants={animated ? cardVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
      whileHover={animated && !loading ? "hover" : undefined}
      whileTap={animated && !loading ? "tap" : undefined}
      className={cardClasses}
      onClick={handleCardClick}
      role={onClick || href ? 'button' : undefined}
      tabIndex={onClick || href ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && (onClick || href)) {
          e.preventDefault()
          handleCardClick()
        }
      }}
    >
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.claimNumber}>
            <FileText className={styles.claimIcon} />
            <span className={styles.claimNumberText}>{claim.claimNumber}</span>
          </div>
          {claim.priority && (
            <PriorityBadge priority={claim.priority} />
          )}
        </div>

        <div className={styles.headerRight}>
          <StatusBadge status={claim.status} compact={compact} />
          {showActions && actions.length > 0 && (
            <motion.button
              className={`${styles.actionsButton} menu-button`}
              onClick={handleActionsClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="More actions"
            >
              <MoreVertical className={styles.actionsIcon} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={styles.cardContent}>
        <div className={styles.clientInfo}>
          <h3 className={styles.clientName}>{claim.clientName}</h3>
          <div className={styles.insuranceInfo}>
            <Building className={styles.insuranceIcon} />
            <span className={styles.insuranceName}>{claim.insuranceCompany}</span>
          </div>
        </div>

        {claim.description && !compact && (
          <p className={styles.description}>{claim.description}</p>
        )}

        <ClaimStats
          itemsCount={claim.itemsCount}
          filesCount={claim.filesCount}
          amount={claim.amount}
          compact={compact}
        />
      </div>

      {/* Footer */}
      <div className={styles.cardFooter}>
        <div className={styles.dateInfo}>
          <Calendar className={styles.dateIcon} />
          <span className={styles.dateText}>
            {compact ? formatDate(claim.dateCreated) : `Created ${getTimeAgo(claim.dateCreated)}`}
          </span>
        </div>

        {claim.assignedTo && (
          <div className={styles.assignedInfo}>
            <User className={styles.assignedIcon} />
            <span className={styles.assignedText}>{claim.assignedTo}</span>
          </div>
        )}

        {(onClick || href) && (
          <div className={styles.viewAction}>
            <ChevronRight className={styles.viewIcon} />
          </div>
        )}
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className={styles.loadingOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.loadingSpinner} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions Menu */}
      {showActions && (
        <FloatingContextMenu
          isVisible={showActionsMenu}
          position={menuPosition}
          onClose={closeActionsMenu}
        >
          <ActionsMenu
            actions={actions}
            claim={claim}
            onClose={closeActionsMenu}
          />
        </FloatingContextMenu>
      )}
    </motion.div>
  )

  // Wrap in Link if href is provided
  return href ? (
    <Link href={href} className={styles.cardLink}>
      {CardContent}
    </Link>
  ) : (
    CardContent
  )
}

export default ClaimCard