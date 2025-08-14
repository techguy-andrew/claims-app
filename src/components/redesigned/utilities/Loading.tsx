'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Card } from '../ui/Card'
import styles from './Loading.module.css'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
  color?: 'primary' | 'secondary' | 'accent'
}

export interface LoadingCardProps {
  title?: string
  description?: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export interface LoadingPageProps {
  title?: string
  description?: string
  className?: string
}

export interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  className?: string
  onClose?: () => void
}

export interface SkeletonLineProps {
  className?: string
  width?: string
}

export interface SkeletonCardProps {
  lines?: number
  showAvatar?: boolean
  showActions?: boolean
  className?: string
}

export interface SkeletonTableProps {
  rows?: number
  columns?: number
  showHeader?: boolean
  className?: string
}

// ============================================================================
// LOADING SPINNER COMPONENT
// ============================================================================

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  className = '',
  color = 'primary'
}) => {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        ease: 'linear',
        repeat: Infinity
      }
    }
  }

  return (
    <motion.div
      className={`${styles.spinner} ${styles[size]} ${styles[color]} ${className}`}
      variants={spinnerVariants}
      animate="animate"
      role="status"
      aria-label="Loading"
    >
      <Loader2 className={styles.spinnerIcon} />
    </motion.div>
  )
}

// ============================================================================
// LOADING CARD COMPONENT
// ============================================================================

export const LoadingCard: React.FC<LoadingCardProps> = ({
  title = 'Loading...',
  description,
  size = 'medium',
  className = ''
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.2
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className={`${styles.loadingCard} ${styles[size]} ${className}`}>
        <div className={styles.cardContent}>
          <motion.div 
            className={styles.spinnerContainer}
            variants={contentVariants}
          >
            <LoadingSpinner size={size} />
          </motion.div>
          
          <motion.div 
            className={styles.textContainer}
            variants={contentVariants}
          >
            <h3 className={styles.title}>{title}</h3>
            {description && (
              <p className={styles.description}>{description}</p>
            )}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}

// ============================================================================
// LOADING PAGE COMPONENT
// ============================================================================

export const LoadingPage: React.FC<LoadingPageProps> = ({
  title = 'Loading...',
  description,
  className = ''
}) => {
  const pageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      className={`${styles.loadingPage} ${className}`}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className={styles.pageContent}
        variants={contentVariants}
      >
        <motion.div variants={itemVariants}>
          <LoadingSpinner size="large" />
        </motion.div>
        
        <motion.h2 
          className={styles.pageTitle}
          variants={itemVariants}
        >
          {title}
        </motion.h2>
        
        {description && (
          <motion.p 
            className={styles.pageDescription}
            variants={itemVariants}
          >
            {description}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// LOADING OVERLAY COMPONENT
// ============================================================================

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  className = '',
  onClose
}) => {
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: -20,
      transition: { duration: 0.2 }
    }
  }

  React.useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`${styles.overlay} ${className}`}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className={styles.overlayModal}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <LoadingSpinner size="large" />
            <p className={styles.overlayMessage}>{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// SKELETON COMPONENTS
// ============================================================================

export const SkeletonLine: React.FC<SkeletonLineProps> = ({ 
  className = '', 
  width = '100%' 
}) => {
  const pulseVariants = {
    pulse: {
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <motion.div
      className={`${styles.skeletonLine} ${className}`}
      style={{ width }}
      variants={pulseVariants}
      animate="pulse"
    />
  )
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  lines = 3,
  showAvatar = false,
  showActions = false,
  className = ''
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className={`${styles.skeletonCard} ${className}`}>
        <div className={styles.skeletonContent}>
          {showAvatar && (
            <motion.div 
              className={styles.skeletonHeader}
              variants={itemVariants}
            >
              <div className={styles.skeletonAvatar} />
              <div className={styles.skeletonHeaderText}>
                <SkeletonLine width="60%" />
                <SkeletonLine width="40%" />
              </div>
            </motion.div>
          )}
          
          <motion.div 
            className={styles.skeletonBody}
            variants={itemVariants}
          >
            {Array.from({ length: lines }).map((_, index) => (
              <SkeletonLine 
                key={index}
                width={index === lines - 1 ? '70%' : '100%'}
                className={styles.skeletonBodyLine}
              />
            ))}
          </motion.div>

          {showActions && (
            <motion.div 
              className={styles.skeletonActions}
              variants={itemVariants}
            >
              <SkeletonLine width="80px" className={styles.skeletonAction} />
              <SkeletonLine width="60px" className={styles.skeletonAction} />
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  className = ''
}) => {
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.div
      className={`${styles.skeletonTable} ${className}`}
      variants={tableVariants}
      initial="hidden"
      animate="visible"
    >
      {showHeader && (
        <motion.div 
          className={styles.skeletonTableHeader}
          variants={rowVariants}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonLine
              key={`header-${colIndex}`}
              width="80%"
              className={styles.skeletonTableCell}
            />
          ))}
        </motion.div>
      )}
      
      <div className={styles.skeletonTableBody}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <motion.div
            key={`row-${rowIndex}`}
            className={styles.skeletonTableRow}
            variants={rowVariants}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <SkeletonLine
                key={`cell-${rowIndex}-${colIndex}`}
                width={colIndex === 0 ? '60%' : '90%'}
                className={styles.skeletonTableCell}
              />
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default {
  LoadingSpinner,
  LoadingCard,
  LoadingPage,
  LoadingOverlay,
  SkeletonLine,
  SkeletonCard,
  SkeletonTable
}