import { toast } from 'sonner'
import { STATUS_CONFIG } from './status-config'
import { ClaimStatus } from '@prisma/client'

/**
 * Unified toast notification utilities that maintain consistent styling
 * across the entire application using semantic status colors
 */

export const showSuccess = (message: string) => {
  toast.success(message, {
    style: {
      background: STATUS_CONFIG.APPROVED.toastColor,
      color: 'white',
      border: 'none'
    }
  })
}

export const showError = (message: string) => {
  toast.error(message, {
    style: {
      background: STATUS_CONFIG.REJECTED.toastColor,
      color: 'white',
      border: 'none'
    }
  })
}

export const showInfo = (message: string) => {
  toast(message, {
    style: {
      background: STATUS_CONFIG.UNDER_REVIEW.toastColor,
      color: 'white',
      border: 'none'
    }
  })
}

/**
 * Status-aware toast notification that uses the exact color
 * associated with the specific status for contextual feedback
 * This is used by StatusSelector for dynamic status-based colors
 */
export const showStatusToast = (message: string, status: ClaimStatus, isError: boolean = false) => {
  if (isError) {
    showError(message)
  } else {
    toast.success(message, {
      style: {
        background: STATUS_CONFIG[status].toastColor,
        color: 'white',
        border: 'none'
      }
    })
  }
}