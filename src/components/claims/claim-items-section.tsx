'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Plus, Package, Edit, Trash2, Eye, MoreVertical, AlertCircle, CheckCircle, File, FileText, Download, Tag, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field } from '@/components/ui/label'
import { SimpleImageModal } from '../files/simple-image-modal'
import { SimplePDFModal } from '../files/simple-pdf-modal'

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

interface ClaimItemsSectionProps {
  claimId: string
  items: ClaimItem[]
  onItemsChange: (items: ClaimItem[]) => void
}

interface ItemFormData {
  itemName: string
  details: string
}

export function ClaimItemsSection({ claimId, items, onItemsChange }: ClaimItemsSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [viewingImage, setViewingImage] = useState<ClaimFile | null>(null)
  const [viewingPDF, setViewingPDF] = useState<ClaimFile | null>(null)
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null)
  const [activeFileActionMenu, setActiveFileActionMenu] = useState<string | null>(null)
  const [fileMenuPosition, setFileMenuPosition] = useState<{ top: number; right: number } | null>(null)
  const menuButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const fileMenuButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  const [formData, setFormData] = useState<ItemFormData>({
    itemName: '',
    details: ''
  })

  const [editFormData, setEditFormData] = useState<ItemFormData>({
    itemName: '',
    details: ''
  })

  // Clear messages after timeout
  const clearMessages = useCallback(() => {
    setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 3000)
  }, [])

  // Handle form changes
  const handleFormChange = useCallback((field: keyof ItemFormData, value: string, isEdit = false) => {
    if (isEdit) {
      setEditFormData(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }, [])

  // Toggle item expansion (accordion style - only one item at a time)
  const toggleItemExpansion = useCallback((itemId: string) => {
    setExpandedItem(prev => prev === itemId ? null : itemId)
  }, [])

  // Add new item
  const handleAddItem = useCallback(async () => {
    if (!formData.itemName.trim()) {
      setError('Item name is required')
      clearMessages()
      return
    }

    setLoading('add')
    setError(null)

    try {
      const response = await fetch(`/api/claims/${claimId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: formData.itemName.trim(),
          details: formData.details.trim() || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add item')
      }

      const newItem = await response.json()
      onItemsChange([...items, newItem])
      
      setFormData({ itemName: '', details: '' })
      setShowAddForm(false)
      setSuccess('Item added successfully')
      clearMessages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item')
      clearMessages()
    } finally {
      setLoading(null)
    }
  }, [claimId, formData, items, onItemsChange, clearMessages])

  // Start editing item
  const handleStartEdit = useCallback((item: ClaimItem) => {
    setEditingItem(item.id)
    setEditFormData({
      itemName: item.itemName,
      details: item.details || ''
    })
  }, [])

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setEditingItem(null)
    setEditFormData({ itemName: '', details: '' })
  }, [])

  // Update item
  const handleUpdateItem = useCallback(async (itemId: string) => {
    if (!editFormData.itemName.trim()) {
      setError('Item name is required')
      clearMessages()
      return
    }

    setLoading(itemId)
    setError(null)

    try {
      const response = await fetch(`/api/claims/${claimId}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: editFormData.itemName.trim(),
          details: editFormData.details.trim() || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update item')
      }

      const updatedItem = await response.json()
      onItemsChange(items.map(item => item.id === itemId ? updatedItem : item))
      
      setEditingItem(null)
      setEditFormData({ itemName: '', details: '' })
      setSuccess('Item updated successfully')
      clearMessages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item')
      clearMessages()
    } finally {
      setLoading(null)
    }
  }, [claimId, editFormData, items, onItemsChange, clearMessages])

  // Delete item
  const handleDeleteItem = useCallback(async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item? Associated files will become unassigned.')) {
      return
    }

    setLoading(itemId)
    setError(null)
    setActiveActionMenu(null)

    try {
      const response = await fetch(`/api/claims/${claimId}/items/${itemId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete item')
      }

      onItemsChange(items.filter(item => item.id !== itemId))
      setSuccess('Item deleted successfully')
      clearMessages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
      clearMessages()
    } finally {
      setLoading(null)
    }
  }, [claimId, items, onItemsChange, clearMessages])

  // Toggle floating menu and calculate position
  const toggleFloatingMenu = useCallback((itemId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (activeActionMenu === itemId) {
      setActiveActionMenu(null)
      setMenuPosition(null)
      return
    }

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const menuWidth = 160
    const menuHeight = 100 // Approximate height for 2 menu items
    
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
    setActiveActionMenu(itemId)
  }, [activeActionMenu])

  // Handle action menu actions
  const handleActionMenuAction = useCallback((action: string, item: ClaimItem) => {
    setActiveActionMenu(null)
    setMenuPosition(null)
    
    switch (action) {
      case 'edit':
        handleStartEdit(item)
        break
      case 'delete':
        handleDeleteItem(item.id)
        break
    }
  }, [handleStartEdit, handleDeleteItem])

  // Handle PDF viewing
  const handleViewPDF = useCallback((file: ClaimFile) => {
    setViewingPDF(file)
  }, [])

  // Handle image viewing  
  const handleViewImage = useCallback((file: ClaimFile) => {
    setViewingImage(file)
  }, [])

  // Handle file download
  const handleDownloadFile = useCallback(async (file: ClaimFile) => {
    try {
      const link = document.createElement('a')
      link.href = `/api/download/${file.id}`
      link.download = file.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
      setError('Failed to download file')
      clearMessages()
    }
  }, [clearMessages])

  // Handle untagging file from item
  const handleUntagFile = useCallback(async (fileId: string) => {
    setLoading(fileId)
    setError(null)
    setActiveFileActionMenu(null)
    
    try {
      const response = await fetch(`/api/claims/${claimId}/files/${fileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: null })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to untag file')
      }

      // Remove file from all items
      const updatedItems = items.map(item => ({
        ...item,
        files: item.files.filter(f => f.id !== fileId)
      }))
      onItemsChange(updatedItems)

      setSuccess('File untagged successfully')
      clearMessages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to untag file')
      clearMessages()
    } finally {
      setLoading(null)
    }
  }, [claimId, items, onItemsChange, clearMessages])

  // Handle deleting file from item  
  const handleDeleteFileFromItem = useCallback(async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return
    }

    setLoading(fileId)
    setError(null)
    setActiveFileActionMenu(null)

    try {
      const response = await fetch(`/api/claims/${claimId}/files/${fileId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete file')
      }

      // Remove file from all items
      const updatedItems = items.map(item => ({
        ...item,
        files: item.files.filter(f => f.id !== fileId)
      }))
      onItemsChange(updatedItems)

      setSuccess('File deleted successfully')
      clearMessages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file')
      clearMessages()
    } finally {
      setLoading(null)
    }
  }, [claimId, items, onItemsChange, clearMessages])

  // Toggle file floating menu and calculate position
  const toggleFileFloatingMenu = useCallback((fileId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (activeFileActionMenu === fileId) {
      setActiveFileActionMenu(null)
      setFileMenuPosition(null)
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
    
    setFileMenuPosition({ top, right })
    setActiveFileActionMenu(fileId)
  }, [activeFileActionMenu])

  // Handle file action menu actions
  const handleFileActionMenuAction = useCallback((action: string, file: ClaimFile) => {
    setActiveFileActionMenu(null)
    setFileMenuPosition(null)
    
    switch (action) {
      case 'view':
        if (file.fileType === 'image') {
          handleViewImage(file)
        } else if (file.fileType === 'pdf') {
          handleViewPDF(file)
        } else {
          window.open(file.fileUrl, '_blank')
        }
        break
      case 'untag':
        handleUntagFile(file.id)
        break
      case 'download':
        handleDownloadFile(file)
        break
      case 'delete':
        handleDeleteFileFromItem(file.id)
        break
    }
  }, [handleViewImage, handleViewPDF, handleDownloadFile, handleUntagFile, handleDeleteFileFromItem])

  // Close floating menu when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Element
    if (!target.closest('.floating-menu') && !target.closest('.menu-button')) {
      setActiveActionMenu(null)
      setMenuPosition(null)
      setActiveFileActionMenu(null)
      setFileMenuPosition(null)
    }
  }, [])

  // Setup click outside listener
  React.useEffect(() => {
    if (activeActionMenu || activeFileActionMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [activeActionMenu, activeFileActionMenu, handleClickOutside])

  // Floating Context Menu Component
  const FloatingContextMenu = ({ item }: { item: ClaimItem }) => {
    if (!menuPosition || activeActionMenu !== item.id) return null

    return (
      <div 
        className="floating-menu fixed z-50 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-xl shadow-lg min-w-[160px] p-1 transition-all duration-200 opacity-100 scale-100"
        style={{
          top: `${menuPosition.top}px`,
          right: `${menuPosition.right}px`
        }}
      >
        <button
          onClick={() => handleActionMenuAction('edit', item)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/80 transition-colors duration-150 text-left text-gray-900"
        >
          <Edit className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">Edit Item</span>
        </button>
        
        
        <button
          onClick={() => handleActionMenuAction('delete', item)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50/80 transition-colors duration-150 text-left text-red-600"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Delete</span>
        </button>
      </div>
    )
  }

  // Floating File Context Menu Component
  const FloatingFileContextMenu = ({ file }: { file: ClaimFile }) => {
    if (!fileMenuPosition || activeFileActionMenu !== file.id) return null

    return (
      <div 
        className="floating-menu fixed z-50 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-xl shadow-lg min-w-[160px] p-1 transition-all duration-200 opacity-100 scale-100"
        style={{
          top: `${fileMenuPosition.top}px`,
          right: `${fileMenuPosition.right}px`
        }}
      >
        <button
          onClick={() => handleFileActionMenuAction('view', file)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/80 transition-colors duration-150 text-left text-gray-900"
        >
          <Eye className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">View</span>
        </button>
        
        <button
          onClick={() => handleFileActionMenuAction('untag', file)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/80 transition-colors duration-150 text-left text-gray-900"
        >
          <Tag className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">Untag</span>
        </button>
        
        <button
          onClick={() => handleFileActionMenuAction('download', file)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/80 transition-colors duration-150 text-left text-gray-900"
        >
          <Download className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">Download</span>
        </button>
        
        <button
          onClick={() => handleFileActionMenuAction('delete', file)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50/80 transition-colors duration-150 text-left text-red-600"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Delete</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Package className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-900">Items & Inventory</h2>
            <p className="text-xs text-gray-600">
              {items.length} items documented
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAddForm(true)}
            variant="modern"
            size="small"
            disabled={showAddForm || loading === 'add'}
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="enterprise-card-sm bg-red-50/80 border-red-200/80 p-4 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="enterprise-card-sm bg-green-50/80 border-green-200/80 p-4 flex items-start gap-3">
          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-green-800">Success</h3>
            <p className="text-sm text-green-700 mt-1 leading-relaxed">{success}</p>
          </div>
        </div>
      )}

      {/* Add Item Form */}
      {showAddForm && (
        <div className="enterprise-card-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-6">Add New Item</h3>
          
          <div className="space-y-4">
            <Field label="Item Name" required error={!formData.itemName.trim() && error ? 'Item name is required' : undefined}>
              <Input
                type="text"
                value={formData.itemName}
                onChange={(e) => handleFormChange('itemName', e.target.value)}
                placeholder="e.g., Dining Table, Sofa, Desk..."
                state={!formData.itemName.trim() && error ? 'error' : 'default'}
              />
            </Field>

            <Field label="Details" helperText="Optional damage description or notes">
              <Textarea
                value={formData.details}
                onChange={(e) => handleFormChange('details', e.target.value)}
                placeholder="e.g., Scratched surface, water damage on left side..."
                rows={3}
              />
            </Field>

            <div className="flex gap-4">
              <Button
                onClick={handleAddItem}
                variant="primary"
                disabled={loading === 'add'}
                className="flex-1 touch-target-lg"
                loading={loading === 'add'}
              >
                Add Item
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false)
                  setFormData({ itemName: '', details: '' })
                }}
                variant="modern"
                disabled={loading === 'add'}
                className="flex-1 touch-target-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Items List */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Items</h3>
            <p className="text-sm text-gray-600">
              {items.length} items • {items.filter(i => i.files.length > 0).length} with files
            </p>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {items.map((item, index) => (
              <div key={item.id} className={`relative ${index !== items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                {editingItem === item.id ? (
                  // Edit Form
                  <div className="p-4 space-y-4">
                    <Field label="Item Name" required>
                      <Input
                        type="text"
                        value={editFormData.itemName}
                        onChange={(e) => handleFormChange('itemName', e.target.value, true)}
                        placeholder="e.g., Dining Table, Sofa, Desk..."
                      />
                    </Field>

                    <Field label="Details">
                      <Textarea
                        value={editFormData.details}
                        onChange={(e) => handleFormChange('details', e.target.value, true)}
                        placeholder="e.g., Scratched surface, water damage..."
                        rows={3}
                      />
                    </Field>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleUpdateItem(item.id)}
                        variant="primary"
                        loading={loading === item.id}
                        className="flex-1"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="modern"
                        onClick={handleCancelEdit}
                        disabled={loading === item.id}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Modern Item View
                  <div 
                    onClick={() => toggleItemExpansion(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggleItemExpansion(item.id)
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-expanded={expandedItem === item.id}
                    aria-controls={`item-content-${item.id}`}
                    className="w-full flex items-center p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg cursor-pointer"
                  >
                    {/* Item Icon */}
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                        <Package className="h-7 w-7 text-gray-500" />
                      </div>
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-medium text-gray-900 truncate mb-1">{item.itemName}</h4>
                      <div className="flex items-center gap-2">
                        {item.details ? (
                          <span className="text-sm text-gray-600 truncate">
                            {item.details}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500 italic">
                            No details provided
                          </span>
                        )}
                        {item.files.length > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {item.files.length} files
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Accordion Controls */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      {/* Chevron for accordion */}
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                          expandedItem === item.id ? "rotate-180" : ""
                        }`}
                      />
                      
                      {/* Three-dot menu button */}
                      <button
                        ref={(el) => { menuButtonRefs.current[item.id] = el }}
                        onClick={(e) => {
                          e.stopPropagation() // Prevent accordion toggle
                          toggleFloatingMenu(item.id, e)
                        }}
                        disabled={loading === item.id}
                        className="menu-button w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        title="More actions"
                      >
                        {loading === item.id ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                        ) : (
                          <MoreVertical className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Floating Context Menu */}
                    <FloatingContextMenu item={item} />
                  </div>
                )}

                {/* Expanded Content - Files */}
                {expandedItem === item.id && item.files.length > 0 && (
                  <div id={`item-content-${item.id}`} className="px-6 pb-6 pt-2 bg-gradient-to-r from-blue-50/30 to-gray-50/30 border-t border-gray-100/80">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full opacity-60"></div>
                      <h4 className="text-sm font-medium text-gray-800">Tagged Files ({item.files.length})</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {item.files.map((file) => (
                        <div key={file.id} className="bg-white rounded-lg border border-gray-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
                          <div className="aspect-video relative overflow-hidden bg-gray-50">
                            {file.fileType === 'image' ? (
                              <Image
                                src={file.fileUrl}
                                alt={file.fileName}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover cursor-pointer group-hover:scale-105 transition-transform duration-200"
                                onClick={() => handleViewImage(file)}
                              />
                            ) : (
                              <div 
                                className="w-full h-full flex items-center justify-center cursor-pointer group-hover:bg-gray-100 transition-colors duration-200"
                                onClick={() => {
                                  if (file.fileType === 'pdf') {
                                    handleViewPDF(file)
                                  } else {
                                    window.open(file.fileUrl, '_blank')
                                  }
                                }}
                              >
                                <div className="text-center">
                                  {file.fileType === 'pdf' ? (
                                    <FileText className="h-8 w-8 text-gray-500 mb-2 mx-auto" />
                                  ) : (
                                    <File className="h-8 w-8 text-gray-500 mb-2 mx-auto" />
                                  )}
                                  <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">{file.fileType}</div>
                                </div>
                              </div>
                            )}
                            <div className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                ref={(el) => { fileMenuButtonRefs.current[file.id] = el }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFileFloatingMenu(file.id, e)
                                }}
                                disabled={loading === file.id}
                                className="menu-button bg-white/90 backdrop-blur-sm rounded-full p-1.5 hover:bg-white transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                title="More actions"
                              >
                                {loading === file.id ? (
                                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                                ) : (
                                  <MoreVertical className="h-4 w-4 text-gray-600" />
                                )}
                              </button>
                            </div>
                            
                            {/* Floating Context Menu */}
                            <FloatingFileContextMenu file={file} />
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium text-gray-900 truncate mb-1">{file.fileName}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(file.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg">
            <div className="p-3 bg-gray-50 rounded-lg w-fit mx-auto mb-4">
              <Package className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">No items added yet</h3>
            <p className="text-sm text-gray-600 mb-4">Start documenting damaged or claimed items</p>
            <Button
              onClick={() => setShowAddForm(true)}
              variant="modern"
              size="small"
            >
              <Plus className="h-4 w-4" />
              Add Your First Item
            </Button>
          </div>
        </div>
      )}

      {/* Image Modal */}
      <SimpleImageModal
        file={viewingImage}
        isOpen={!!viewingImage}
        onClose={() => setViewingImage(null)}
      />

      {/* PDF Modal */}
      <SimplePDFModal
        file={viewingPDF}
        isOpen={!!viewingPDF}
        onClose={() => setViewingPDF(null)}
      />
    </div>
  )
}