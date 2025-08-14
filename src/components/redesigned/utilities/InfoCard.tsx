'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, LucideIcon } from 'lucide-react'
import { useToast } from '../../../hooks/use-toast'
import styles from './InfoCard.module.css'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface InfoCardProps {
  label: string
  value: string
  icon: LucideIcon
  delay?: number
  onCopy?: (value: string) => void
  showCopy?: boolean
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
  copyMessage?: string
  formatValue?: (value: string) => string
  sensitive?: boolean
}

export interface InfoCardGroupProps {
  cards: Omit<InfoCardProps, 'delay'>[]
  title?: string
  description?: string
  className?: string
  columns?: 1 | 2 | 3 | 4
  staggerDelay?: number
}

// ============================================================================
// INFO CARD COMPONENT
// ============================================================================

export const InfoCard: React.FC<InfoCardProps> = ({
  label,
  value,
  icon: Icon,
  delay = 0,
  onCopy,
  showCopy = true,
  variant = 'default',
  className = '',
  copyMessage,
  formatValue,
  sensitive = false
}) => {
  const [copied, setCopied] = useState(false)
  const [isRevealed, setIsRevealed] = useState(!sensitive)
  const { addToast } = useToast()

  const displayValue = React.useMemo(() => {
    if (sensitive && !isRevealed) {
      return '••••••••'
    }
    return formatValue ? formatValue(value) : value
  }, [value, formatValue, sensitive, isRevealed])

  const handleCopy = async () => {
    if (copied) return

    try {
      if (onCopy) {
        onCopy(value)
      } else {
        await navigator.clipboard.writeText(value)
      }

      setCopied(true)
      addToast({
        title: 'Copied!',
        message: copyMessage || `${label} copied to clipboard`,
        type: 'success',
        duration: 2000
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      addToast({
        title: 'Failed to copy',
        message: 'Could not copy to clipboard',
        type: 'error',
        duration: 3000
      })
    }
  }

  const handleReveal = () => {
    if (sensitive) {
      setIsRevealed(true)
    }
  }

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        delay: delay,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -90 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        delay: delay + 0.2,
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        delay: delay + 0.3,
        duration: 0.3
      }
    }
  }

  const copyButtonVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: delay + 0.4,
        type: "spring",
        stiffness: 200
      }
    },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  }

  return (
    <motion.div
      className={`${styles.infoCard} ${styles[variant]} ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
    >
      <div className={styles.cardContent}>
        {/* Icon Container */}
        <motion.div 
          className={styles.iconContainer}
          variants={iconVariants}
        >
          <Icon className={styles.icon} />
        </motion.div>

        {/* Content Container */}
        <motion.div 
          className={styles.contentContainer}
          variants={contentVariants}
          onClick={sensitive && !isRevealed ? handleReveal : undefined}
          style={{ cursor: sensitive && !isRevealed ? 'pointer' : 'default' }}
        >
          <p className={styles.label}>{label}</p>
          <p className={`${styles.value} ${sensitive && !isRevealed ? styles.sensitive : ''}`}>
            {displayValue}
          </p>
          {sensitive && !isRevealed && (
            <span className={styles.revealHint}>Click to reveal</span>
          )}
        </motion.div>

        {/* Copy Button */}
        {showCopy && (
          <motion.button
            className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
            onClick={handleCopy}
            variants={copyButtonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={copied}
            aria-label={`Copy ${label.toLowerCase()}`}
            title={copied ? 'Copied!' : `Copy ${label.toLowerCase()}`}
          >
            <motion.div
              initial={false}
              animate={{ rotate: copied ? 360 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {copied ? (
                <Check className={styles.copyIcon} />
              ) : (
                <Copy className={styles.copyIcon} />
              )}
            </motion.div>
          </motion.button>
        )}
      </div>

      {/* Hover Background Effect */}
      <motion.div
        className={styles.hoverEffect}
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

// ============================================================================
// INFO CARD GROUP COMPONENT
// ============================================================================

export const InfoCardGroup: React.FC<InfoCardGroupProps> = ({
  cards,
  title,
  description,
  className = '',
  columns = 2,
  staggerDelay = 0.1
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <motion.div
      className={`${styles.cardGroup} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {(title || description) && (
        <motion.div 
          className={styles.groupHeader}
          variants={headerVariants}
        >
          {title && <h3 className={styles.groupTitle}>{title}</h3>}
          {description && <p className={styles.groupDescription}>{description}</p>}
        </motion.div>
      )}

      <div 
        className={styles.cardsGrid}
        style={{ '--columns': columns } as React.CSSProperties}
      >
        {cards.map((card, index) => (
          <InfoCard
            key={`${card.label}-${index}`}
            {...card}
            delay={index * staggerDelay}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default InfoCard