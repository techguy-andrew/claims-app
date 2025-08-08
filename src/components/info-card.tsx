'use client'

import { Copy } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface InfoCardProps {
  label: string
  value: string
  icon: LucideIcon
  delay?: number
  onCopy?: (value: string) => void
}

export function InfoCard({ label, value, icon: Icon, onCopy }: InfoCardProps) {
  const handleCopy = () => {
    if (onCopy) {
      onCopy(value)
    } else {
      navigator.clipboard.writeText(value)
    }
  }

  return (
    <div className="group relative">
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Icon className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm text-gray-900 font-medium truncate">{value}</p>
          </div>
          <button 
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            title={`Copy ${label.toLowerCase()}`}
          >
            <Copy className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}