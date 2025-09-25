import { ClaimStatus } from '@prisma/client'

export interface StatusConfig {
  label: string
  variant: 'secondary'
  className: string
  toastColor: string
}

export const STATUS_CONFIG: Record<ClaimStatus, StatusConfig> = {
  PENDING: {
    label: 'Pending',
    variant: 'secondary' as const,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
    toastColor: 'bg-yellow-500'
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    variant: 'secondary' as const,
    className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    toastColor: 'bg-blue-500'
  },
  APPROVED: {
    label: 'Approved',
    variant: 'secondary' as const,
    className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    toastColor: 'bg-green-500'
  },
  REJECTED: {
    label: 'Rejected',
    variant: 'secondary' as const,
    className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
    toastColor: 'bg-red-500'
  },
  CLOSED: {
    label: 'Closed',
    variant: 'secondary' as const,
    className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
    toastColor: 'bg-gray-500'
  },
}

// Legacy status mapping for backward compatibility (if needed)
export const LEGACY_STATUS_MAPPING = {
  'pending': 'PENDING',
  'in-progress': 'UNDER_REVIEW',
  'completed': 'APPROVED',
  'cancelled': 'REJECTED'
} as const

// Helper function to get status config
export function getStatusConfig(status: ClaimStatus): StatusConfig {
  return STATUS_CONFIG[status]
}

// Helper function to get status display label
export function getStatusLabel(status: ClaimStatus): string {
  return STATUS_CONFIG[status].label
}