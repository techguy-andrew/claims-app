'use client'

import React from 'react'
import { X, Check } from 'lucide-react'

interface Library001SaveCancelButtonsProps {
  onSave: () => void
  onCancel: () => void
  isSaving?: boolean
  disabled?: boolean
  saveTitle?: string
  cancelTitle?: string
  className?: string
}

export function Library001SaveCancelButtons({
  onSave,
  onCancel,
  isSaving = false,
  disabled = false,
  saveTitle = "Save",
  cancelTitle = "Cancel",
  className = ""
}: Library001SaveCancelButtonsProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Cancel Button */}
      <button
        onClick={onCancel}
        disabled={disabled || isSaving}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
        title={cancelTitle}
      >
        <X className="h-4 w-4 text-gray-600" />
      </button>
      
      {/* Save Button */}
      <button
        onClick={onSave}
        disabled={disabled || isSaving}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-blue-50 transition-colors disabled:opacity-50"
        title={saveTitle}
      >
        {isSaving ? (
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        ) : (
          <Check className="h-4 w-4 text-blue-600" />
        )}
      </button>
    </div>
  )
}

// Default export for convenience
export default Library001SaveCancelButtons