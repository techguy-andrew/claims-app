'use client'

import React, { useState, useCallback, useRef } from 'react'
import { 
  ChevronDown, 
  Package,
  Check,
  Edit,
  Trash2
} from 'lucide-react'
import { Library001FilesList } from '../files/library001-files-list'
import { Library001ImageModal } from '../files/library001-image-modal'
import { Library001PDFModal } from '../files/library001-pdf-modal'
import { Library001InvisibleInput } from '../shared/library001-invisible-input'
import { Library001FloatingContextMenu, type Library001MenuAction } from '../shared/library001-floating-context-menu'
import { Library001SaveCancelButtons } from '../shared/library001-save-cancel-buttons'

// ============================================================================
// TYPES
// ============================================================================

export interface Library001ClaimItem {
  id: string
  itemName: string
  details: string | null
  createdAt: string
  updatedAt: string
  files: Library001ClaimFile[]
}

export interface Library001ClaimFile {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number | null
  uploadedAt: string
  item?: {
    id: string
    itemName: string
  } | null
}

interface Library001ItemsCardProps {
  item: Library001ClaimItem
  claimId: string
  onUpdate?: (item: Library001ClaimItem) => void
  onDelete?: (itemId: string) => void
  onFileAction?: (action: string, file: Library001ClaimFile) => void
}


// ============================================================================
// FLOATING TOAST COMPONENT
// ============================================================================

const Library001Toast: React.FC<{ message: string; visible: boolean }> = ({ message, visible }) => (
  <div
    className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 z-50 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
    }`}
  >
    <div className="flex items-center space-x-2">
      <Check className="h-4 w-4" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  </div>
)


// ============================================================================
// MAIN COMPONENT - Clean Architecture
// ============================================================================

export function Library001ItemsCard({ item, claimId, onUpdate, onDelete, onFileAction }: Library001ItemsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draftData, setDraftData] = useState({
    itemName: item.itemName,
    details: item.details || ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [viewingImage, setViewingImage] = useState<Library001ClaimFile | null>(null)
  const [viewingPDF, setViewingPDF] = useState<Library001ClaimFile | null>(null)
  
  // Store scroll position without external dependencies
  const scrollPosRef = useRef(0)
  // Track if we're currently transitioning to edit mode to prevent header clicks
  const isTransitioningToEditRef = useRef(false)

  const enterEditMode = useCallback(() => {
    // Set transition flag to prevent header clicks during this operation
    isTransitioningToEditRef.current = true
    
    scrollPosRef.current = window.scrollY
    setIsEditing(true)
    setDraftData({
      itemName: item.itemName,
      details: item.details || ''
    })
    
    // Auto-expand if not already expanded
    if (!isExpanded) {
      setIsExpanded(true)
    }
    
    // Clear transition flag after a brief delay
    setTimeout(() => {
      isTransitioningToEditRef.current = false
    }, 100)
  }, [item, isExpanded])

  const handleSave = useCallback(async () => {
    if (!draftData.itemName.trim()) return
    
    setIsSaving(true)
    
    try {
      const response = await fetch(`/api/claims/${claimId}/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: draftData.itemName.trim(),
          details: draftData.details.trim() || null
        })
      })
      
      if (!response.ok) throw new Error('Failed to update')
      
      const updated = await response.json()
      onUpdate?.(updated)
      
      // Update local item data
      Object.assign(item, updated)
      
      setIsEditing(false)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
      
      // Restore scroll position
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosRef.current)
      })
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }, [draftData, item, claimId, onUpdate])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setDraftData({
      itemName: item.itemName,
      details: item.details || ''
    })
    
    // Restore scroll position
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosRef.current)
    })
  }, [item])

  // Handle file actions with integrated modal support
  const handleInternalFileAction = useCallback(async (action: string, file: Library001ClaimFile) => {
    switch (action) {
      case 'view':
        // Handle view internally with our own modals
        if (file.fileType === 'image') {
          setViewingImage(file)
        } else if (file.fileType === 'pdf') {
          setViewingPDF(file)
        } else {
          window.open(file.fileUrl, '_blank')
        }
        break
        
      case 'download':
        // Handle download directly
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
        break
        
      case 'untag':
        // Handle untag with API call and state update
        try {
          const response = await fetch(`/api/claims/${claimId}/files/${file.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId: null })
          })

          if (!response.ok) {
            throw new Error('Failed to untag file')
          }

          // Update local item files
          item.files = item.files.filter(f => f.id !== file.id)
          
          // Notify parent if handler exists
          onFileAction?.('untag', file)
          
          // Force re-render
          setIsExpanded(prev => prev)
        } catch (err) {
          console.error('Failed to untag file:', err)
        }
        break
        
      case 'delete':
        // Handle delete with confirmation
        if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
          return
        }

        try {
          const response = await fetch(`/api/claims/${claimId}/files/${file.id}`, {
            method: 'DELETE'
          })

          if (!response.ok) {
            throw new Error('Failed to delete file')
          }

          // Update local item files
          item.files = item.files.filter(f => f.id !== file.id)
          
          // Notify parent if handler exists
          onFileAction?.('delete', file)
          
          // Force re-render
          setIsExpanded(prev => prev)
        } catch (err) {
          console.error('Failed to delete file:', err)
        }
        break
        
      default:
        // Pass through any other actions to parent
        onFileAction?.(action, file)
    }
  }, [claimId, item, onFileAction])

  // Menu actions configuration
  const menuActions: Library001MenuAction[] = [
    {
      id: 'edit',
      label: 'Edit Item',
      icon: <Edit className="h-4 w-4" />,
      onClick: enterEditMode
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => onDelete?.(item.id),
      variant: 'danger' as const
    }
  ]

  const hasFiles = item.files.length > 0

  return (
    <>
      <div className={`bg-white border rounded-lg transition-all duration-200 ${
        isExpanded ? 'border-blue-200 shadow-sm' : 'border-gray-200 hover:border-gray-300'
      }`}>
        {/* Header */}
        <div 
          className={`flex items-center p-4 ${
            hasFiles && !isEditing ? 'cursor-pointer' : ''
          }`}
          onClick={() => {
            if (hasFiles && !isEditing && !isTransitioningToEditRef.current) {
              setIsExpanded(!isExpanded)
            }
          }}
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mr-4">
            <Package className="h-6 w-6 text-blue-600" />
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <Library001InvisibleInput
              value={draftData.itemName}
              onChange={(v) => setDraftData(prev => ({ ...prev, itemName: v }))}
              onSave={handleSave}
              onCancel={handleCancel}
              isEditing={isEditing}
              className="text-base font-semibold text-gray-900 truncate"
              placeholder="Item name"
            />
          </div>

          {/* Action Buttons Area - The Magic Morph */}
          <div className="flex items-center space-x-2 ml-4">
            {!isEditing ? (
              <>
                <ChevronDown 
                  className={`h-5 w-5 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180 text-blue-600' : 'text-gray-400'
                  } ${hasFiles ? '' : 'opacity-30'}`}
                />
                
                <Library001FloatingContextMenu actions={menuActions} />
              </>
            ) : (
              <Library001SaveCancelButtons
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={isSaving}
              />
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-100">
            {/* Description */}
            <div className="p-4 border-b border-gray-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
              <Library001InvisibleInput
                value={draftData.details}
                onChange={(v) => setDraftData(prev => ({ ...prev, details: v }))}
                onSave={handleSave}
                onCancel={handleCancel}
                isEditing={isEditing}
                className="text-sm text-gray-600 leading-relaxed"
                placeholder="Add description..."
                multiline
              />
            </div>

            {/* Files */}
            {hasFiles && (
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Files ({item.files.length})
                </h4>
                <Library001FilesList
                  files={item.files}
                  onFileAction={(action, file) => {
                    // Handle 'tag' as 'untag' since files are already tagged to this item
                    const actualAction = action === 'tag' ? 'untag' : action
                    handleInternalFileAction(actualAction, file)
                  }}
                  emptyStateText="No files tagged to this item"
                  showThumbnails={true}
                />
              </div>
            )}
          </div>
        )}
      </div>


      {/* Toast Notification */}
      <Library001Toast message="Changes saved" visible={showToast} />

      {/* Image Modal */}
      <Library001ImageModal
        file={viewingImage}
        isOpen={!!viewingImage}
        onClose={() => setViewingImage(null)}
      />

      {/* PDF Modal */}
      <Library001PDFModal
        file={viewingPDF}
        isOpen={!!viewingPDF}
        onClose={() => setViewingPDF(null)}
      />
    </>
  )
}

// Default export for convenience
export default Library001ItemsCard