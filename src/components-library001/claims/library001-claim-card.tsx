'use client'

import React from 'react'
import { FileText, ChevronRight } from 'lucide-react'
import { library001Cn } from '../utils/library001-cn'

// ============================================================================
// TYPES
// ============================================================================

export interface Library001ClaimCardProps {
  claimNumber: string
  clientName: string
  insuranceCompany: string
  status: 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'CLOSED'
  onClick?: () => void
}

// ============================================================================
// STYLES
// ============================================================================

const statusGradients = {
  OPEN: 'from-blue-400 to-blue-500',
  IN_PROGRESS: 'from-amber-400 to-orange-500',
  UNDER_REVIEW: 'from-purple-400 to-purple-500',
  APPROVED: 'from-green-400 to-emerald-500',
  DENIED: 'from-red-400 to-red-500',
  CLOSED: 'from-gray-400 to-gray-500'
}

const statusLabels = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  DENIED: 'Denied',
  CLOSED: 'Closed'
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Library001ClaimCard({ 
  claimNumber, 
  clientName, 
  insuranceCompany, 
  status, 
  onClick 
}: Library001ClaimCardProps) {
  return (
    <div 
      onClick={onClick}
      className={library001Cn(
        'group bg-white/95 backdrop-blur-xl border border-gray-200/80',
        'rounded-lg shadow-sm p-6 md:p-4 mb-6 md:mb-4 cursor-pointer',
        'hover:shadow-md transition-all duration-200 hover:-translate-y-0.5',
        'active:scale-[0.99] min-h-[120px] md:min-h-[100px]'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Claim Number - Primary */}
          <div className="flex items-center gap-4 mb-5 md:mb-4">
            <div className="w-12 h-12 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <FileText className="h-7 w-7 md:h-6 md:w-6 text-gray-600" />
            </div>
            <h3 className="text-xl md:text-lg font-semibold text-gray-900 tracking-tight leading-tight">
              {claimNumber}
            </h3>
          </div>
          
          {/* Insurance Company */}
          <p className="text-sm text-gray-600 mb-3 md:mb-2 ml-16 leading-relaxed">
            {insuranceCompany}
          </p>
          
          {/* Client Name */}
          <p className="text-base font-medium text-gray-800 ml-16 leading-snug">
            {clientName}
          </p>
        </div>
        
        {/* Arrow indicator - Mobile optimized */}
        <div className="flex items-center justify-center min-h-[48px] min-w-[48px] md:min-h-[44px] md:min-w-[44px]">
          <ChevronRight className="h-7 w-7 md:h-6 md:w-6 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
        </div>
      </div>
      
      {/* Status indicator - Mobile optimized badge */}
      <div className="mt-6 md:mt-4 ml-16">
        <span className={library001Cn(
          'inline-flex items-center px-4 py-2.5 md:py-2 rounded-xl',
          'text-sm md:text-xs font-medium text-white',
          'bg-gradient-to-r shadow-lg transition-all duration-200 hover:shadow-xl',
          'min-h-[36px] md:min-h-[28px]',
          statusGradients[status]
        )}>
          {statusLabels[status]}
        </span>
      </div>
    </div>
  )
}

export default Library001ClaimCard