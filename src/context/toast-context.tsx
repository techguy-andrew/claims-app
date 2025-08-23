'use client'

import React, { createContext, useContext } from 'react'
import { useToast, type UseToastReturn } from '@/hooks/use-toast'
import { Library001ToastContainer } from '@/components-library001/ui/library001-toast'

const ToastContext = createContext<UseToastReturn | null>(null)

export interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const toastState = useToast()

  return (
    <ToastContext.Provider value={toastState}>
      {children}
      <Library001ToastContainer 
        toasts={toastState.toasts.map(toast => ({ ...toast, onClose: toastState.hideToast }))}
        onClose={toastState.hideToast}
      />
    </ToastContext.Provider>
  )
}

export function useToastContext(): UseToastReturn {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}