'use client'

import { useEffect } from 'react'
import { X, Download, ExternalLink } from 'lucide-react'
// import { Button } from '@/components/ui/button'
import { ClaimFile } from './files-list'

interface SimplePDFModalProps {
  file: ClaimFile | null
  isOpen: boolean
  onClose: () => void
}

export function SimplePDFModal({ file, isOpen, onClose }: SimplePDFModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen || !file || file.fileType !== 'pdf') {
    return null
  }

  const handleDownload = async () => {
    try {
      const link = document.createElement('a')
      link.href = `/api/download/${file.id}`
      link.download = file.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleOpenInNewTab = () => {
    window.open(`/api/pdf/${file.id}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-medium text-gray-900">{file.fileName}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              title="Download PDF"
            >
              <Download className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={handleOpenInNewTab}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <X className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Iframe */}
      <div className="pt-16 h-full">
        <iframe
          src={`/api/pdf/${file.id}`}
          className="w-full h-full border-0"
          title={`PDF Viewer - ${file.fileName}`}
        />
      </div>

      {/* Click outside to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      />
    </div>
  )
}