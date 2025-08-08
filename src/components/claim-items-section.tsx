'use client'

import { useState, useCallback } from 'react'
import { Plus, Package, Edit, Trash2, ChevronDown, ChevronRight, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field } from '@/components/ui/label'
import { SimpleImageModal } from './simple-image-modal'

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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [viewingImage, setViewingImage] = useState<ClaimFile | null>(null)

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

  // Toggle item expansion
  const toggleItemExpansion = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
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
            <p className="text-xs text-gray-600">{items.length} items documented</p>
          </div>
        </div>
        
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

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-green-800">Success</h3>
            <p className="text-sm text-green-700 mt-1">{success}</p>
          </div>
        </div>
      )}

      {/* Add Item Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Add New Item</h3>
          
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

            <div className="flex gap-3">
              <Button
                onClick={handleAddItem}
                variant="modern"
                size="small"
                disabled={loading === 'add'}
                className="flex-1"
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
                size="small"
                disabled={loading === 'add'}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {items.length === 0 ? (
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
                className="mx-auto"
              >
                <Plus className="h-4 w-4" />
                Add Your First Item
              </Button>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {editingItem === item.id ? (
                // Edit Form
                <div className="space-y-4">
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

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleUpdateItem(item.id)}
                      loading={loading === item.id}
                      className="flex-1"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="modern"
                      size="small"
                      onClick={handleCancelEdit}
                      disabled={loading === item.id}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => toggleItemExpansion(item.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          {expandedItems.has(item.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900">{item.itemName}</h3>
                        {item.files.length > 0 && (
                          <span className="flex items-center gap-1 text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                            <ImageIcon className="h-3 w-3" />
                            {item.files.length}
                          </span>
                        )}
                      </div>
                      
                      {item.details && (
                        <p className="text-gray-600 text-sm ml-8">{item.details}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="modern"
                        size="small"
                        onClick={() => handleStartEdit(item)}
                        disabled={loading === item.id}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="small"
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={loading === item.id}
                        loading={loading === item.id}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Content - Files */}
                  {expandedItems.has(item.id) && item.files.length > 0 && (
                    <div className="mt-4 ml-8 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Associated Files ({item.files.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {item.files.map((file) => (
                          <div key={file.id} className="relative group">
                            {file.fileType === 'image' ? (
                              <img
                                src={file.fileUrl}
                                alt={file.fileName}
                                className="w-full h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setViewingImage(file)}
                              />
                            ) : (
                              <div 
                                className="w-full h-20 bg-gray-100 rounded-lg border flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                onClick={() => window.open(file.fileUrl, '_blank')}
                              >
                                <div className="text-center">
                                  <div className="text-lg mb-1">📄</div>
                                  <div className="text-xs text-gray-600 truncate">{file.fileType.toUpperCase()}</div>
                                </div>
                              </div>
                            )}
                            <div className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-xs p-1 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity">
                              {file.fileName}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Image Modal */}
      <SimpleImageModal
        file={viewingImage}
        isOpen={!!viewingImage}
        onClose={() => setViewingImage(null)}
      />
    </div>
  )
}