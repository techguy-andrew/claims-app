'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { 
  ChevronDown, 
  Package, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Tag, 
  FileText, 
  File,
  MoreVertical,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export interface ClaimItem {
  id: string
  itemName: string
  details: string | null
  createdAt: string
  updatedAt: string
  files: ClaimFile[]
}

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

interface ItemsCardProps {
  item: ClaimItem
  claimId: string
  isExpanded?: boolean
  onToggleExpanded?: (itemId: string) => void
  onEdit?: (item: ClaimItem) => void
  onDelete?: (itemId: string) => void
  onViewFile?: (file: ClaimFile) => void
  onDownloadFile?: (file: ClaimFile) => void
  onUntagFile?: (fileId: string) => void
  onDeleteFile?: (fileId: string) => void
  loading?: boolean
  className?: string
}

export function ItemsCard({
  item,
  claimId,
  isExpanded = false,
  onToggleExpanded,
  onEdit,
  onDelete,
  onViewFile,
  onDownloadFile,
  onUntagFile,
  onDeleteFile,
  loading = false,
  className = ''
}: ItemsCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [fileActions, setFileActions] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null)
  const [fileMenuPosition, setFileMenuPosition] = useState<{ top: number; left: number } | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ itemName: item.itemName, details: item.details || '' })
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const actionButtonRef = useRef<HTMLButtonElement>(null)
  const fileButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Update item via API
  const updateItem = useCallback(async () => {
    if (!editData.itemName.trim()) {
      setError('Item name is required')
      return false
    }

    try {
      setIsUpdating(true)
      setError(null)
      
      const response = await fetch(`/api/claims/${claimId}/items/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemName: editData.itemName.trim(),
          details: editData.details.trim() || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update item')
      }

      const updatedItem = await response.json()
      
      // Update parent component if onEdit callback is available
      onEdit?.(updatedItem)
      
      // Update local state to reflect changes
      item.itemName = updatedItem.itemName
      item.details = updatedItem.details
      
      setIsEditing(false)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item')
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [editData, item, onEdit, claimId])

  const handleToggleExpanded = useCallback(() => {
    // Only allow expansion if there are files to show
    if (item.files.length > 0) {
      onToggleExpanded?.(item.id)
    }
  }, [item.id, onToggleExpanded, item.files.length])

  const handleEdit = useCallback(() => {
    setShowActions(false)
    // Auto-expand the card if it's not already expanded
    if (!isExpanded) {
      onToggleExpanded?.(item.id)
    }
    setIsEditing(true)
    setEditData({ itemName: item.itemName, details: item.details || '' })
    setError(null)
  }, [item, isExpanded, onToggleExpanded])
  
  const handleSave = useCallback(async () => {
    const success = await updateItem()
    if (success) {
      setIsEditing(false)
    }
  }, [updateItem])
  
  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setEditData({ itemName: item.itemName, details: item.details || '' })
    setError(null)
  }, [item])

  const handleDelete = useCallback(() => {
    setShowActions(false)
    onDelete?.(item.id)
  }, [item.id, onDelete])

  const handleFileAction = useCallback((action: string, file: ClaimFile) => {
    setFileActions(null)
    
    switch (action) {
      case 'view':
        onViewFile?.(file)
        break
      case 'download':
        onDownloadFile?.(file)
        break
      case 'untag':
        onUntagFile?.(file.id)
        break
      case 'delete':
        onDeleteFile?.(file.id)
        break
    }
  }, [onViewFile, onDownloadFile, onUntagFile, onDeleteFile])

  // Calculate dropdown position with improved logic
  const calculateMenuPosition = useCallback((buttonRef: HTMLButtonElement | null) => {
    if (!buttonRef) return { top: 0, left: 0 }
    
    const rect = buttonRef.getBoundingClientRect()
    const menuWidth = 160 // Updated width for new design
    const menuHeight = 140 // Approximate height for 4 menu items
    
    let top = rect.bottom + 8
    let left = rect.right - menuWidth
    
    // Flip vertically if too close to bottom
    if (top + menuHeight > window.innerHeight - 20) {
      top = rect.top - menuHeight - 8
    }
    
    // Flip horizontally if too close to left edge
    if (left < 20) {
      left = rect.left
    }
    
    // Ensure menu stays within viewport
    if (left + menuWidth > window.innerWidth - 20) {
      left = window.innerWidth - menuWidth - 20
    }
    
    return { top, left }
  }, [])

  // Handle action button click
  const handleActionClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    
    if (showActions) {
      setShowActions(false)
      setMenuPosition(null)
    } else {
      const position = calculateMenuPosition(actionButtonRef.current)
      setMenuPosition(position)
      setShowActions(true)
    }
  }, [showActions, calculateMenuPosition])

  // Handle file action button click
  const handleFileActionClick = useCallback((e: React.MouseEvent<HTMLButtonElement>, fileId: string) => {
    e.stopPropagation()
    
    if (fileActions === fileId) {
      setFileActions(null)
      setFileMenuPosition(null)
    } else {
      const position = calculateMenuPosition(fileButtonRefs.current[fileId])
      setFileMenuPosition(position)
      setFileActions(fileId)
    }
  }, [fileActions, calculateMenuPosition])

  // Close menus and edit mode when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      
      // Handle dropdown menus with improved selector matching
      if (!target.closest('[data-dropdown-menu]') && !target.closest('[data-dropdown-button]') && 
          !target.closest('.floating-menu') && !target.closest('.menu-button')) {
        setShowActions(false)
        setMenuPosition(null)
        setFileActions(null)
        setFileMenuPosition(null)
      }
      
      // Handle edit mode - cancel if clicking outside the expanded card
      if (isEditing && isExpanded && !target.closest('.border-t.border-gray-100.bg-white')) {
        handleCancel()
      }
    }

    if (showActions || fileActions || isEditing) {
      document.addEventListener('click', handleClickOutside, true)
      return () => document.removeEventListener('click', handleClickOutside, true)
    }
  }, [showActions, fileActions, isEditing, isExpanded, handleCancel])
  
  // Handle keyboard shortcuts for edit mode
  useEffect(() => {
    if (!isEditing) return
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleCancel()
      } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        handleSave()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isEditing, handleCancel, handleSave])

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea && isEditing) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'
      // Set height to scrollHeight with minimum of 80px
      const newHeight = Math.max(80, textarea.scrollHeight)
      textarea.style.height = `${newHeight}px`
    }
  }, [editData.details, isEditing])

  // Portal-rendered dropdown menu
  const ActionDropdown = () => {
    if (!showActions || !menuPosition) return null

    return createPortal(
      <>
        <div className="fixed inset-0 z-[9998]" />
        <div 
          data-dropdown-menu
          className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg min-w-[144px] py-1"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`
          }}
        >
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 text-gray-400" />
            <span>Edit</span>
          </button>
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center space-x-2"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            <span>Delete</span>
          </button>
        </div>
      </>,
      document.body
    )
  }

  // Portal-rendered file dropdown menu with improved styling
  const FileActionDropdown = ({ file }: { file: ClaimFile }) => {
    if (fileActions !== file.id || !fileMenuPosition) return null

    return createPortal(
      <>
        <div className="fixed inset-0 z-[9998]" />
        <div 
          data-dropdown-menu
          className="fixed z-[9999] bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-xl shadow-lg min-w-[160px] p-1 transition-all duration-200 opacity-100 scale-100"
          style={{
            top: `${fileMenuPosition.top}px`,
            left: `${fileMenuPosition.left}px`
          }}
        >
          <button
            onClick={() => handleFileAction('view', file)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/80 transition-colors duration-150 text-left text-gray-900"
          >
            <Eye className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">View</span>
          </button>
          
          <button
            onClick={() => handleFileAction('download', file)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/80 transition-colors duration-150 text-left text-gray-900"
          >
            <Download className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Download</span>
          </button>
          
          <button
            onClick={() => handleFileAction('untag', file)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/80 transition-colors duration-150 text-left text-gray-900"
          >
            <Tag className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Untag</span>
          </button>
          
          <button
            onClick={() => handleFileAction('delete', file)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50/80 transition-colors duration-150 text-left text-red-600"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>
      </>,
      document.body
    )
  }

  return (
    <Card className={`group relative border-gray-200 hover:border-gray-300 transition-all duration-300 ${
      isEditing ? 'border-blue-300 shadow-md' : ''
    } ${
      isExpanded ? 'border-blue-200 shadow-sm' : ''
    } ${className}`}>
      {/* Main Item Header */}
      <CardHeader 
        className={`p-0 transition-all duration-200 ${
          isEditing ? '' : (
            item.files.length > 0 ? 'cursor-pointer hover:bg-gray-50/50' : 'cursor-default'
          )
        }`}
        onClick={isEditing ? undefined : handleToggleExpanded}
      >
        <div className={`flex items-center p-4 space-x-4 min-h-[80px] touch-manipulation transition-all duration-300 ${
          isEditing ? 'bg-blue-50/30' : ''
        } ${
          isExpanded && !isEditing ? 'pb-3' : ''
        }`}>
          {/* Item Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          {/* Item Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate mb-1">
              {item.itemName}
            </h3>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            {!isEditing && (
              <>
                {/* Expand/Collapse Arrow */}
                <ChevronDown 
                  className={`h-5 w-5 transition-all duration-300 ${
                    isExpanded ? 'rotate-180 text-blue-600' : 'text-gray-400'
                  } ${
                    item.files.length > 0 ? 'hover:text-blue-500 cursor-pointer' : 'text-gray-300 cursor-default'
                  }`}
                />
                
                {/* More Actions Menu */}
                <Button
                  ref={actionButtonRef}
                  data-dropdown-button
                  variant="ghost"
                  size="small"
                  className="w-8 h-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity"
                  onClick={handleActionClick}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                  ) : (
                    <MoreVertical className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Expanded Content - Title Edit, Description and Files */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-white">
          {/* Title Edit Section - Only show when editing */}
          {isEditing && (
            <div className="p-4 border-b border-gray-100">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Item Name</h4>
                  <Input
                    value={editData.itemName}
                    onChange={(e) => setEditData(prev => ({ ...prev, itemName: e.target.value }))}
                    placeholder="Item name"
                    className="text-base font-semibold"
                    state={error && !editData.itemName.trim() ? 'error' : 'default'}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSave()
                      } else if (e.key === 'Escape') {
                        handleCancel()
                      }
                    }}
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="p-4 border-b border-gray-100">
            {isEditing ? (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                <Textarea
                  ref={textareaRef}
                  value={editData.details}
                  onChange={(e) => setEditData(prev => ({ ...prev, details: e.target.value }))}
                  placeholder="Add details..."
                  className="text-sm resize-none transition-all duration-200"
                  style={{ minHeight: '80px', overflow: 'hidden' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      handleCancel()
                    }
                  }}
                />
              </div>
            ) : (
              item.details ? (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.details}
                  </p>
                </div>
              ) : (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-500 italic">
                    No description provided
                  </p>
                </div>
              )
            )}
          </div>
          
          {/* Files Section */}
          {item.files.length > 0 ? (
            <div className="p-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Files ({item.files.length})
                </h4>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                  {item.files.map((file, index) => (
                    <div 
                      key={file.id} 
                      className={`relative flex items-center p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 ${
                        index !== item.files.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      {/* File Thumbnail */}
                      <div className="flex-shrink-0 mr-4">
                        <div 
                          className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => handleFileAction('view', file)}
                        >
                          {file.fileType === 'image' ? (
                            <img
                              src={file.fileUrl}
                              alt={file.fileName}
                              className="w-full h-full object-cover"
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

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <h5 className="text-base font-medium text-gray-900 truncate mb-1">{file.fileName}</h5>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {new Date(file.uploadedAt).toLocaleDateString()} • {file.fileType.toUpperCase()}
                          </span>
                          {file.fileSize && (
                            <span className="text-sm text-gray-500">
                              • {(file.fileSize / 1024 / 1024).toFixed(1)} MB
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Menu Button */}
                      <div className="flex-shrink-0">
                        <button
                          ref={(el) => { fileButtonRefs.current[file.id] = el }}
                          onClick={(e) => handleFileActionClick(e, file.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          title="More actions"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>

                      {/* File Action Dropdown */}
                      <FileActionDropdown file={file} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No files attached</h3>
              <p className="text-xs text-gray-500">Upload files to see them here</p>
            </div>
          )}

          {/* Edit Actions - Save/Cancel buttons */}
          {isEditing && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isUpdating}
                  className="flex-1 touch-target-lg"
                  size="large"
                  onClick={handleSave}
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="modern"
                  onClick={handleCancel}
                  disabled={isUpdating}
                  className="flex-1 touch-target-lg"
                  size="large"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Portal-rendered dropdown menus */}
      <ActionDropdown />
    </Card>
  )
}