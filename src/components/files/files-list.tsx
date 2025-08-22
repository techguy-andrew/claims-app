'use client'

import React from 'react'
import { Eye, Download, Tag, Trash2, FileText, File } from 'lucide-react'
import Image from 'next/image'
import { FloatingContextMenu, type MenuAction } from '../shared/floating-context-menu'

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

  // Sort files by most recent first
  const sortedFiles = [...files].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

  // Create menu actions for each file
  const createFileMenuActions = (file: ClaimFile): MenuAction[] => [
    {
      id: 'view',
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: () => handleViewFile(file)
    },
    {
      id: 'tag',
      label: 'Tag Item',
      icon: <Tag className="h-4 w-4" />,
      onClick: () => onFileAction?.('tag', file)
    },
    {
      id: 'download',
      label: 'Download',
      icon: <Download className="h-4 w-4" />,
      onClick: () => onFileAction?.('download', file)
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => onFileAction?.('delete', file),
      variant: 'danger' as const
    }
  ]

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
              <FloatingContextMenu 
                actions={createFileMenuActions(file)}
                disabled={loading === file.id}
                loading={loading === file.id}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}