'use client'

import { useToast as useRedesignedToast, type ToastData } from '@/components/redesigned/ui/Toast'

// Re-export the redesigned toast types and hook for backward compatibility
export type { ToastData as Toast, ToastType } from '@/components/redesigned/ui/Toast'
export type ToastProps = ToastData

// Legacy interface for backward compatibility
export interface UseToastReturn {
  toasts: ToastData[]
  showToast: (toast: Omit<ToastData, 'id'>) => void
  addToast: (toast: Omit<ToastData, 'id'>) => void
  hideToast: (id: string) => void
  removeToast: (id: string) => void
  clearAllToasts: () => void
}

export function useToast(): UseToastReturn {
  const { toasts, addToast, removeToast, clearAllToasts } = useRedesignedToast()

  return {
    toasts,
    showToast: addToast, // Backward compatibility alias
    addToast,
    hideToast: removeToast, // Backward compatibility alias  
    removeToast,
    clearAllToasts,
  }
}