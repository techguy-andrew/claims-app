'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'
import { library001Cn } from '../utils/library001-cn'

// ============================================================================
// TYPES
// ============================================================================

export type Library001ToastType = 'success' | 'error' | 'warning' | 'info'
export type Library001ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

export interface Library001ToastProps {
  id?: string
  type?: Library001ToastType
  title?: string
  message: string
  duration?: number
  closable?: boolean
  onClose?: () => void
  position?: Library001ToastPosition
}

// ============================================================================
// STYLES
// ============================================================================

const toastVariants = {
  success: {
    icon: CheckCircle,
    styles: 'bg-green-50 border-green-200 text-green-900',
    iconStyles: 'text-green-600'
  },
  error: {
    icon: XCircle,
    styles: 'bg-red-50 border-red-200 text-red-900',
    iconStyles: 'text-red-600'
  },
  warning: {
    icon: AlertCircle,
    styles: 'bg-amber-50 border-amber-200 text-amber-900',
    iconStyles: 'text-amber-600'
  },
  info: {
    icon: Info,
    styles: 'bg-blue-50 border-blue-200 text-blue-900',
    iconStyles: 'text-blue-600'
  }
}

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Library001Toast({
  type = 'info',
  title,
  message,
  duration = 5000,
  closable = true,
  onClose,
  position = 'top-right'
}: Library001ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isLeaving, setIsLeaving] = useState(false)
  
  const variant = toastVariants[type]
  const Icon = variant.icon

  const handleClose = useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }, [onClose])

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(handleClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, handleClose])

  if (!isVisible) return null

  return (
    <div
      className={library001Cn(
        'fixed z-50 flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300 min-w-[320px] max-w-md',
        variant.styles,
        positionStyles[position],
        isLeaving ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      )}
      role="alert"
    >
      <Icon className={library001Cn('w-5 h-5 flex-shrink-0 mt-0.5', variant.iconStyles)} />
      
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="font-semibold text-sm mb-1">{title}</h3>
        )}
        <p className="text-sm">{message}</p>
      </div>

      {closable && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors duration-200"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ============================================================================
// TOAST CONTAINER COMPONENT
// ============================================================================

export interface Library001ToastContainerProps {
  toasts: Library001ToastProps[]
  position?: Library001ToastPosition
}

export function Library001ToastContainer({ 
  toasts, 
  position = 'top-right' 
}: Library001ToastContainerProps) {
  return (
    <div className={library001Cn('fixed z-50', positionStyles[position])}>
      <div className="flex flex-col gap-3">
        {toasts.map((toast, index) => (
          <Library001Toast key={toast.id || index} {...toast} position={position} />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// HOOK FOR TOAST MANAGEMENT
// ============================================================================

export function useLibrary001Toast() {
  const [toasts, setToasts] = useState<Library001ToastProps[]>([])

  const showToast = useCallback((toast: Omit<Library001ToastProps, 'id'>) => {
    const id = Date.now().toString()
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])
    
    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, toast.duration || 5000)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, showToast, removeToast }
}

export default Library001Toast