'use client'

import React from 'react'
import { ToastProvider as RedesignedToastProvider, useToast } from '@/components/redesigned/ui/Toast'
import { type UseToastReturn } from '@/hooks/use-toast'

export interface ToastProviderProps {
  children: React.ReactNode
  maxToasts?: number
  defaultDuration?: number
}

// Re-export the redesigned ToastProvider with same interface for compatibility
export function ToastProvider({ children, maxToasts, defaultDuration }: ToastProviderProps) {
  return (
    <RedesignedToastProvider maxToasts={maxToasts} defaultDuration={defaultDuration}>
      {children}
    </RedesignedToastProvider>
  )
}

// Re-export useToast as useToastContext for backward compatibility
export function useToastContext(): UseToastReturn {
  const context = useToast()
  return {
    toasts: context.toasts,
    showToast: context.addToast,
    addToast: context.addToast,
    hideToast: context.removeToast,
    removeToast: context.removeToast,
    clearAllToasts: context.clearAllToasts,
  }
}