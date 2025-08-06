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

export function InfoCard({ label, value, icon: Icon, delay = 0, onCopy }: InfoCardProps) {
  const handleCopy = () => {
    if (onCopy) {
      onCopy(value)
    } else {
      navigator.clipboard.writeText(value)
    }
  }

  return (
    <div 
      className="group relative"
      style={{
        animation: `slideUp 0.6s ease-out ${delay}ms both`,
      }}
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            <Icon className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">{label}</p>
            <p className="text-base text-gray-900 font-medium leading-relaxed">{value}</p>
          </div>
          <button 
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg"
          >
            <Copy className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}