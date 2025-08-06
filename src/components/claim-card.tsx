'use client'

import { FileText, ChevronRight } from 'lucide-react'

interface ClaimCardProps {
  claimNumber: string
  clientName: string
  insuranceCompany: string
  status: 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'CLOSED'
  onClick?: () => void
}

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

export function ClaimCard({ claimNumber, clientName, insuranceCompany, status, onClick }: ClaimCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group bg-white/80 backdrop-blur-xl rounded-2xl p-5 mb-4 cursor-pointer 
                 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 
                 hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Claim Number - Primary */}
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{claimNumber}</h3>
          </div>
          
          {/* Insurance Company */}
          <p className="text-sm text-gray-600 mb-2 ml-12">
            {insuranceCompany}
          </p>
          
          {/* Client Name */}
          <p className="text-base font-medium text-gray-800 ml-12">{clientName}</p>
        </div>
        
        {/* Arrow indicator */}
        <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
      
      {/* Status indicator - Premium gradient badge */}
      <div className="mt-4 ml-12">
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${statusGradients[status]} shadow-lg`}>
          {statusLabels[status]}
        </span>
      </div>
    </div>
  )
}