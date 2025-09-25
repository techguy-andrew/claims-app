'use client'

import { useState, useTransition } from 'react'
import { ClaimStatus } from '@prisma/client'
import { Badge } from '@/components/active-components/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { updateClaimStatus } from '@/app/claims/[claimId]/actions'
import { toast } from 'sonner'
import { STATUS_CONFIG } from '@/lib/status-config'

interface StatusSelectorProps {
  claimId: string
  currentStatus: ClaimStatus
  editable?: boolean
}


export function StatusSelector({ claimId, currentStatus, editable = true }: StatusSelectorProps) {
  const [status, setStatus] = useState<ClaimStatus>(currentStatus)
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (newStatus: ClaimStatus) => {
    if (!editable || isPending) return

    setStatus(newStatus)

    startTransition(async () => {
      const result = await updateClaimStatus(claimId, newStatus)

      if (!result.success) {
        // Revert the status on failure
        setStatus(currentStatus)
        toast.error(result.error || 'Failed to update status', {
          style: {
            background: STATUS_CONFIG.REJECTED.toastColor,
            color: 'white',
            border: 'none'
          }
        })
      } else {
        toast.success(`Status updated to ${STATUS_CONFIG[newStatus].label}`, {
          style: {
            background: STATUS_CONFIG[newStatus].toastColor,
            color: 'white',
            border: 'none'
          }
        })
      }
    })
  }

  const currentConfig = STATUS_CONFIG[status]

  if (!editable) {
    return (
      <Badge
        variant={currentConfig.variant}
        className={currentConfig.className}
      >
        {currentConfig.label}
      </Badge>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="inline-flex items-center gap-1 cursor-pointer group">
          <Badge
            variant={currentConfig.variant}
            className={`${currentConfig.className} ${isPending ? 'opacity-50' : 'group-hover:opacity-80'} transition-opacity`}
          >
            {currentConfig.label}
          </Badge>
          <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => (
          <DropdownMenuItem
            key={statusKey}
            onClick={() => handleStatusChange(statusKey as ClaimStatus)}
            disabled={isPending || statusKey === status}
            className="flex items-center gap-2"
          >
            <div className={`w-2 h-2 rounded-full ${config.className.split(' ')[0]}`} />
            {config.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}