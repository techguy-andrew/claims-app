'use client'

import React, { useState, useCallback } from 'react'
import { ChevronDown, LucideIcon } from 'lucide-react'
import styles from './Card.module.css'

// ============================================================================
// TYPES
// ============================================================================

export interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'elevated' | 'flat'
  padding?: 'none' | 'small' | 'default' | 'large'
  onClick?: () => void
  hoverable?: boolean
  disabled?: boolean
}

export interface CardHeaderProps {
  children: React.ReactNode
  className?: string
  icon?: LucideIcon
  actions?: React.ReactNode
  expandable?: boolean
  expanded?: boolean
  onToggleExpand?: () => void
}

export interface CardTitleProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export interface CardContentProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'small' | 'default' | 'large'
}

export interface CardFooterProps {
  children: React.ReactNode
  className?: string
  alignment?: 'left' | 'center' | 'right' | 'spaceBetween'
}

// ============================================================================
// MAIN CARD COMPONENT - Items-Card Inspired Design
// ============================================================================

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'default',
  onClick,
  hoverable = false,
  disabled = false
}) => {
  const combinedClassName = [
    styles.card,
    styles[variant],
    padding !== 'default' && styles[`padding-${padding}`],
    onClick && styles.clickable,
    hoverable && styles.hoverable,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ')

  const handleClick = useCallback(() => {
    if (onClick && !disabled) {
      onClick()
    }
  }, [onClick, disabled])

  const CardComponent = onClick ? 'button' : 'div'

  return (
    <CardComponent
      className={combinedClassName}
      onClick={handleClick}
      disabled={disabled}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
    >
      {children}
    </CardComponent>
  )
}

// ============================================================================
// CARD HEADER - With Items-Card Header Pattern
// ============================================================================

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  icon: Icon,
  actions,
  expandable = false,
  expanded = false,
  onToggleExpand
}) => {
  const combinedClassName = [
    styles.header,
    expandable && styles.expandable,
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      className={combinedClassName}
      onClick={expandable ? onToggleExpand : undefined}
      role={expandable ? 'button' : undefined}
      tabIndex={expandable ? 0 : undefined}
      aria-expanded={expandable ? expanded : undefined}
    >
      {/* Icon Section - Inspired by items-card icon styling */}
      {Icon && (
        <div className={styles.headerIcon}>
          <Icon className={styles.icon} size={24} />
        </div>
      )}

      {/* Content Section */}
      <div className={styles.headerContent}>
        {children}
      </div>

      {/* Actions Section */}
      <div className={styles.headerActions}>
        {expandable && (
          <ChevronDown 
            className={`${styles.expandIcon} ${expanded ? styles.expanded : ''}`}
            size={20}
          />
        )}
        {actions}
      </div>
    </div>
  )
}

// ============================================================================
// CARD TITLE
// ============================================================================

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
  as: Component = 'h3'
}) => {
  const combinedClassName = [
    styles.title,
    className
  ].filter(Boolean).join(' ')

  return (
    <Component className={combinedClassName}>
      {children}
    </Component>
  )
}

// ============================================================================
// CARD DESCRIPTION
// ============================================================================

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = ''
}) => {
  const combinedClassName = [
    styles.description,
    className
  ].filter(Boolean).join(' ')

  return (
    <p className={combinedClassName}>
      {children}
    </p>
  )
}

// ============================================================================
// CARD CONTENT
// ============================================================================

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  padding = 'default'
}) => {
  const combinedClassName = [
    styles.content,
    padding !== 'default' && styles[`content-padding-${padding}`],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  )
}

// ============================================================================
// CARD FOOTER
// ============================================================================

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  alignment = 'right'
}) => {
  const combinedClassName = [
    styles.footer,
    styles[`footer-${alignment}`],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  )
}

// ============================================================================
// EXPANDABLE CARD WRAPPER - Items-Card Inspired
// ============================================================================

export interface ExpandableCardProps extends Omit<CardProps, 'children'> {
  header: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
  icon?: LucideIcon
  headerActions?: React.ReactNode
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  header,
  children,
  defaultExpanded = false,
  icon,
  headerActions,
  ...cardProps
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const handleToggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  return (
    <Card {...cardProps} className={`${styles.expandableCard} ${cardProps.className || ''}`}>
      <CardHeader
        icon={icon}
        actions={headerActions}
        expandable={true}
        expanded={isExpanded}
        onToggleExpand={handleToggleExpand}
      >
        {header}
      </CardHeader>
      
      {isExpanded && (
        <div className={styles.expandableContent}>
          {children}
        </div>
      )}
    </Card>
  )
}

// ============================================================================
// CARD GRID - Layout Component
// ============================================================================

export interface CardGridProps {
  children: React.ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4 | 'auto'
  gap?: 'small' | 'default' | 'large'
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  className = '',
  columns = 'auto',
  gap = 'default'
}) => {
  const combinedClassName = [
    styles.cardGrid,
    styles[`grid-columns-${columns}`],
    styles[`grid-gap-${gap}`],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  )
}