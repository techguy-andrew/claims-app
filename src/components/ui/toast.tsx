'use client'

import React from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, type, title, message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isLeaving, setIsLeaving] = React.useState(false)

  React.useEffect(() => {
    // Trigger entrance animation
    const showTimer = setTimeout(() => setIsVisible(true), 10)
    
    // Auto-dismiss timer
    const hideTimer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(() => onClose(id), 300) // Allow for exit animation
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [id, duration, onClose])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => onClose(id), 300)
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className={`
      flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-md
      ${getBgColor()}
      transform transition-all duration-300 ease-out
      ${
        isLeaving 
          ? 'translate-x-full opacity-0 scale-95' 
          : isVisible 
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      }
    `}>
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium ${
          type === 'success' ? 'text-green-800' :
          type === 'error' ? 'text-red-800' : 'text-blue-800'
        }`}>
          {title}
        </h4>
        {message && (
          <p className={`text-sm mt-1 ${
            type === 'success' ? 'text-green-700' :
            type === 'error' ? 'text-red-700' : 'text-blue-700'
          }`}>
            {message}
          </p>
        )}
      </div>

      <button
        onClick={handleClose}
        className={`flex-shrink-0 p-1 rounded-md transition-colors duration-200 ${
          type === 'success' ? 'hover:bg-green-100 text-green-600' :
          type === 'error' ? 'hover:bg-red-100 text-red-600' : 'hover:bg-blue-100 text-blue-600'
        }`}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export interface ToastContainerProps {
  toasts: ToastProps[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-24 right-4 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  )
}