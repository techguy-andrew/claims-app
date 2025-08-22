'use client'

import React, { useState, useCallback, useRef } from 'react'
import { MoreVertical, Eye, Download, Tag, Trash2, FileText, File } from 'lucide-react'
import Image from 'next/image'

// Types
export interface ClaimFile {
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

interface FilesListProps {
  files: ClaimFile[]
  onFileAction?: (action: 'view' | 'download' | 'tag' | 'delete', file: ClaimFile) => void
  loading?: string | null
  emptyStateText?: string
  showThumbnails?: boolean
  className?: string
}

export function FilesList({ 
  files, 
  onFileAction, 
  loading = null, 
  emptyStateText = "No files available",
  showThumbnails = true,
  className = ""
}: FilesListProps) {
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null)
  const menuButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  // Sort files by most recent first
  const sortedFiles = [...files].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

  // Toggle floating menu and calculate position
  const toggleFloatingMenu = useCallback((fileId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (activeActionMenu === fileId) {
      setActiveActionMenu(null)
      setMenuPosition(null)
      return
    }

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const menuWidth = 160
    const menuHeight = 140 // Approximate height for 3 menu items
    
    let top = rect.bottom + 8
    let right = window.innerWidth - rect.right
    
    // Flip vertically if too close to bottom
    if (top + menuHeight > window.innerHeight - 20) {
      top = rect.top - menuHeight - 8
    }
    
    // Flip horizontally if too close to left edge
    if (right + menuWidth > window.innerWidth - 20) {
      right = 20
    }
    
    setMenuPosition({ top, right })
    setActiveActionMenu(fileId)
  }, [activeActionMenu])

  // Handle action menu actions
  const handleActionMenuAction = useCallback((action: string, file: ClaimFile) => {
    setActiveActionMenu(null)
    setMenuPosition(null)
    
    switch (action) {
      case 'view':
        if (file.fileType === 'image') {
          onFileAction?.('view', file)
        } else if (file.fileType === 'pdf') {
          onFileAction?.('view', file)
        } else {
          window.open(file.fileUrl, '_blank')
        }
        break
      case 'tag':
        onFileAction?.('tag', file)
        break
      case 'download':
        onFileAction?.('download', file)
        break
      case 'delete':
        onFileAction?.('delete', file)
        break
    }
  }, [onFileAction])

  // Close floating menu when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Element
    if (!target.closest('.floating-menu') && !target.closest('.menu-button')) {
      setActiveActionMenu(null)
      setMenuPosition(null)
    }
  }, [])

  // Setup click outside listener
  React.useEffect(() => {
    if (activeActionMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [activeActionMenu, handleClickOutside])

  // Floating Context Menu Component
  const FloatingContextMenu = ({ file }: { file: ClaimFile }) => {
    if (!menuPosition || activeActionMenu !== file.id) return null

    return (
      <div 
        className="floating-menu fixed z-50 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-xl shadow-lg min-w-[160px] p-1 transition-all duration-200 opacity-100 scale-100"
        style={{
          top: `${menuPosition.top}px`,
          right: `${menuPosition.right}px`
        }}
      >
        <button
          onClick={() => handleActionMenuAction('view', file)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/80 transition-colors duration-150 text-left text-gray-900"
        >
          <Eye className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">View</span>
        </button>
        
        <button
          onClick={() => handleActionMenuAction('tag', file)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/80 transition-colors duration-150 text-left text-gray-900"
        >
          <Tag className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">Tag Item</span>
        </button>
        
        <button
          onClick={() => handleActionMenuAction('download', file)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/80 transition-colors duration-150 text-left text-gray-900"
        >
          <Download className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">Download</span>
        </button>
        
        <button
          onClick={() => handleActionMenuAction('delete', file)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50/80 transition-colors duration-150 text-left text-red-600"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Delete</span>
        </button>
      </div>
    )
  }

  // Handle file view action
  const handleViewFile = (file: ClaimFile) => {
    if (file.fileType === 'image') {
      onFileAction?.('view', file)
    } else if (file.fileType === 'pdf') {
      onFileAction?.('view', file)
    } else {
      window.open(file.fileUrl, '_blank')
    }
  }

  // Empty state
  if (sortedFiles.length === 0) {
    return (
      <div className={`text-center py-6 px-4 ${className}`}>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="p-3 bg-gray-100 rounded-lg w-fit mx-auto mb-3">
            <File className="h-5 w-5 text-gray-500" />
          </div>
          <p className="text-sm text-gray-600">{emptyStateText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        {sortedFiles.map((file, index) => (
          <div key={file.id} className={`relative flex items-center p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 ${index !== sortedFiles.length - 1 ? 'border-b border-gray-100' : ''}`}>
            {/* File Thumbnail */}
            {showThumbnails && (
              <div className="flex-shrink-0 mr-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200 relative"
                     onClick={() => handleViewFile(file)}>
                  {file.fileType === 'image' ? (
                    <Image
                      src={file.fileUrl}
                      alt={file.fileName}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {file.fileType === 'pdf' ? (
                        <FileText className="h-7 w-7 text-gray-500" />
                      ) : (
                        <File className="h-7 w-7 text-gray-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-medium text-gray-900 truncate mb-1">{file.fileName}</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {new Date(file.uploadedAt).toLocaleDateString()} • {file.fileType.toUpperCase()}
                </span>
                {file.item && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <Tag className="h-3 w-3 mr-1" />
                    {file.item.itemName}
                  </span>
                )}
              </div>
            </div>

            {/* Menu Button */}
            <div className="flex-shrink-0">
              <button
                ref={(el) => { menuButtonRefs.current[file.id] = el }}
                onClick={(e) => toggleFloatingMenu(file.id, e)}
                disabled={loading === file.id}
                className="menu-button w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                title="More actions"
              >
                {loading === file.id ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                ) : (
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>

            {/* Floating Context Menu */}
            <FloatingContextMenu file={file} />
          </div>
        ))}
      </div>
    </div>
  )
}