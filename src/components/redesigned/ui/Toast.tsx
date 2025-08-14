'use client'

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { Check, X, AlertCircle, Info, AlertTriangle, LucideIcon } from 'lucide-react'
import styles from './Toast.module.css'

// ============================================================================
// TYPES
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, 'id'>) => void
  removeToast: (id: string) => void
  clearAllToasts: () => void
}

// ============================================================================
// TOAST CONTEXT
// ============================================================================

const ToastContext = createContext<ToastContextType | null>(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// ============================================================================
// TOAST PROVIDER
// ============================================================================

interface ToastProviderProps {
  children: React.ReactNode
  maxToasts?: number
  defaultDuration?: number
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  defaultDuration = 5000
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastData = {
      ...toast,
      id,
      duration: toast.duration ?? defaultDuration
    }

    setToasts(prev => {
      const updated = [newToast, ...prev]
      // Limit number of toasts
      return updated.slice(0, maxToasts)
    })

    // Auto-remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }, [maxToasts, defaultDuration])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

// ============================================================================
// INDIVIDUAL TOAST COMPONENT
// ============================================================================

interface ToastProps {
  toast: ToastData
  onRemove: (id: string) => void
}

const ToastIcons: Record<ToastType, LucideIcon> = {
  success: Check,
  error: X,
  warning: AlertTriangle,
  info: Info
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleRemove = useCallback(() => {
    setIsRemoving(true)
    setTimeout(() => {
      onRemove(toast.id)
    }, 150) // Match CSS animation duration
  }, [toast.id, onRemove])

  const Icon = ToastIcons[toast.type]

  const toastClassName = [
    styles.toast,
    styles[toast.type],
    isVisible && styles.visible,
    isRemoving && styles.removing
  ].filter(Boolean).join(' ')

  return (
    <div className={toastClassName} role="alert" aria-live="polite">
      {/* Icon */}
      <div className={styles.icon}>
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.title}>{toast.title}</div>
        {toast.description && (
          <div className={styles.description}>{toast.description}</div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {toast.action && (
          <button
            className={styles.actionButton}
            onClick={toast.action.onClick}
          >
            {toast.action.label}
          </button>
        )}
        <button
          className={styles.closeButton}
          onClick={handleRemove}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// TOAST CONTAINER
// ============================================================================

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || toasts.length === 0) return null

  return createPortal(
    <div className={styles.container}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>,
    document.body
  )
}

// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================

export const useToastHelpers = () => {
  const { addToast } = useToast()

  const success = useCallback((title: string, description?: string, options?: Partial<ToastData>) => {
    addToast({
      type: 'success',
      title,
      description,
      ...options
    })
  }, [addToast])

  const error = useCallback((title: string, description?: string, options?: Partial<ToastData>) => {
    addToast({
      type: 'error',
      title,
      description,
      duration: 7000, // Longer duration for errors
      ...options
    })
  }, [addToast])

  const warning = useCallback((title: string, description?: string, options?: Partial<ToastData>) => {
    addToast({
      type: 'warning',
      title,
      description,
      ...options
    })
  }, [addToast])

  const info = useCallback((title: string, description?: string, options?: Partial<ToastData>) => {
    addToast({
      type: 'info',
      title,
      description,
      ...options
    })
  }, [addToast])

  return { success, error, warning, info }
}

// ============================================================================
// SIMPLE TOAST COMPONENT (Items-Card Style)
// ============================================================================

interface SimpleToastProps {
  message: string
  visible: boolean
  type?: ToastType
  className?: string
}

export const SimpleToast: React.FC<SimpleToastProps> = ({
  message,
  visible,
  type = 'success',
  className = ''
}) => {
  const Icon = ToastIcons[type]
  
  const toastClassName = [
    styles.simpleToast,
    styles[type],
    visible ? styles.visible : styles.hidden,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={toastClassName}>
      <div className={styles.simpleToastContent}>
        <Icon className={styles.simpleToastIcon} size={16} />
        <span className={styles.simpleToastMessage}>{message}</span>
      </div>
    </div>
  )
}