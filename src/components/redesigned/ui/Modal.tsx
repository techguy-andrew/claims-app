'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, LucideIcon } from 'lucide-react'
import { Button } from './Button'
import styles from './Modal.module.css'

// ============================================================================
// TYPES
// ============================================================================

export interface ModalProps {
  open: boolean
  onClose: () => void
  size?: 'small' | 'default' | 'large' | 'extraLarge' | 'fullScreen'
  variant?: 'default' | 'glass' | 'centered'
  blur?: boolean
  scrollable?: boolean
  loading?: boolean
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  children: React.ReactNode
  className?: string
}

export interface ModalHeaderProps {
  children: React.ReactNode
  onClose?: () => void
  showCloseButton?: boolean
  icon?: LucideIcon
  className?: string
}

export interface ModalTitleProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export interface ModalDescriptionProps {
  children: React.ReactNode
  className?: string
}

export interface ModalBodyProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'small' | 'default' | 'large'
}

export interface ModalFooterProps {
  children: React.ReactNode
  className?: string
  alignment?: 'left' | 'center' | 'right' | 'spaceBetween'
}

// ============================================================================
// MAIN MODAL COMPONENT
// ============================================================================

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size = 'default',
  variant = 'default',
  blur = true,
  scrollable = false,
  loading = false,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  children,
  className = ''
}) => {
  const [isClosing, setIsClosing] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure we're mounted (for SSR compatibility)
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClose = useCallback(() => {
    if (loading) return
    
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200) // Match CSS animation duration
  }, [loading, onClose])

  // Handle keyboard events
  useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    
    // Prevent body scroll
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = originalStyle
    }
  }, [open, closeOnEscape, handleClose])

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleClose()
    }
  }, [closeOnOverlayClick, handleClose])

  // Don't render if not mounted (SSR compatibility) or not open
  if (!mounted || !open) return null

  const overlayClassName = [
    styles.overlay,
    styles[variant],
    blur && styles.blur,
    isClosing && styles.closing
  ].filter(Boolean).join(' ')

  const contentClassName = [
    styles.content,
    styles[size],
    scrollable && styles.scrollable,
    loading && styles.loading,
    isClosing && styles.closing,
    className
  ].filter(Boolean).join(' ')

  return createPortal(
    <div className={overlayClassName} onClick={handleOverlayClick}>
      <div className={contentClassName} role="dialog" aria-modal="true">
        {/* Global close button */}
        {showCloseButton && (
          <button
            className={styles.globalCloseButton}
            onClick={handleClose}
            disabled={loading}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}
        
        {children}
      </div>
    </div>,
    document.body
  )
}

// ============================================================================
// MODAL HEADER
// ============================================================================

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  onClose,
  showCloseButton = false,
  icon: Icon,
  className = ''
}) => {
  const combinedClassName = [
    styles.header,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={combinedClassName}>
      {/* Icon */}
      {Icon && (
        <div className={styles.headerIcon}>
          <Icon size={24} />
        </div>
      )}
      
      {/* Content */}
      <div className={styles.headerContent}>
        {children}
      </div>

      {/* Close button */}
      {showCloseButton && onClose && (
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}

// ============================================================================
// MODAL TITLE
// ============================================================================

export const ModalTitle: React.FC<ModalTitleProps> = ({
  children,
  className = '',
  as: Component = 'h2'
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
// MODAL DESCRIPTION
// ============================================================================

export const ModalDescription: React.FC<ModalDescriptionProps> = ({
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
// MODAL BODY
// ============================================================================

export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className = '',
  padding = 'default'
}) => {
  const combinedClassName = [
    styles.body,
    styles[`body-padding-${padding}`],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  )
}

// ============================================================================
// MODAL FOOTER
// ============================================================================

export const ModalFooter: React.FC<ModalFooterProps> = ({
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
// CONFIRMATION MODAL HELPER
// ============================================================================

interface ConfirmationModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'destructive' | 'default'
  loading?: boolean
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false
}) => {
  const handleConfirm = useCallback(() => {
    onConfirm()
    if (!loading) {
      onClose()
    }
  }, [onConfirm, onClose, loading])

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      size="small"
      closeOnEscape={!loading}
      closeOnOverlayClick={!loading}
      loading={loading}
    >
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        {description && (
          <ModalDescription>{description}</ModalDescription>
        )}
      </ModalHeader>
      
      <ModalFooter alignment="spaceBetween">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'destructive' ? 'destructive' : 'primary'}
          onClick={handleConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  )
}