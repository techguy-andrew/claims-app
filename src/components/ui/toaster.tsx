'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastProvider,
  ToastViewport,
} from '@/components/ui/toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex items-center gap-2">
              {title && !description && <span>{title}</span>}
              {description && <span>{description}</span>}
            </div>
            {action}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}