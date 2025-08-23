'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { X, Search, Plus, Tag, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field } from '@/components/ui/label'
import { Library001ClaimItem } from './library001-items-card'
import { Library001ClaimFile } from '../files/library001-files-list'

interface Library001ItemTagModalProps {
  isOpen: boolean
  onClose: () => void
  file: Library001ClaimFile | null
  items: Library001ClaimItem[]
  onTagFile: (fileId: string, itemId: string | null) => Promise<void>
  onCreateItem: (itemName: string, details?: string) => Promise<Library001ClaimItem>
}

interface NewItemFormData {
  itemName: string
  details: string
}

export function Library001ItemTagModal({
  isOpen,
  onClose,
  file,
  items,
  onTagFile,
  onCreateItem
}: Library001ItemTagModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [newItemForm, setNewItemForm] = useState<NewItemFormData>({
    itemName: '',
    details: ''
  })

  // Reset form state
  const resetForm = useCallback(() => {
    setSearchTerm('')
    setShowCreateForm(false)
    setNewItemForm({ itemName: '', details: '' })
    setError(null)
  }, [])

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items
    
    const lowerSearch = searchTerm.toLowerCase()
    return items.filter(item =>
      item.itemName.toLowerCase().includes(lowerSearch) ||
      (item.details && item.details.toLowerCase().includes(lowerSearch))
    )
  }, [items, searchTerm])

  // Handle tagging file to existing item
  const handleTagToItem = useCallback(async (itemId: string | null) => {
    if (!file) return
    
    setLoading(true)
    setError(null)
    
    try {
      await onTagFile(file.id, itemId)
      onClose()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to tag file')
    } finally {
      setLoading(false)
    }
  }, [file, onTagFile, onClose, resetForm])

  // Handle creating new item and tagging file to it
  const handleCreateAndTag = useCallback(async () => {
    if (!file || !newItemForm.itemName.trim()) {
      setError('Item name is required')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const newItem = await onCreateItem(
        newItemForm.itemName.trim(),
        newItemForm.details.trim() || undefined
      )
      await onTagFile(file.id, newItem.id)
      onClose()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item and tag file')
    } finally {
      setLoading(false)
    }
  }, [file, newItemForm, onCreateItem, onTagFile, onClose, resetForm])

  // Handle modal close
  const handleClose = useCallback(() => {
    if (!loading) {
      resetForm()
      onClose()
    }
  }, [loading, resetForm, onClose])

  // Don't render if not open or no file
  if (!isOpen || !file) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-2xl md:rounded-xl shadow-xl w-full max-w-lg md:mx-4 max-h-[90vh] md:max-h-[80vh] overflow-hidden mobile-action-sheet animate-slide-up"
        style={{
          animation: 'slide-up 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards'
        }}
      >
        {/* Mobile Handle Bar */}
        <div className="md:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2"></div>
        
        {/* Header - Mobile Optimized */}
        <div className="flex items-start md:items-center justify-between p-6 md:p-4 border-b border-gray-200">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0 min-h-[44px] min-w-[44px] md:min-h-[36px] md:min-w-[36px] flex items-center justify-center">
              <Tag className="h-5 w-5 md:h-4 md:w-4 text-gray-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl md:text-lg font-semibold text-gray-900 mb-2 md:mb-1 leading-tight">Tag File to Item</h2>
              <p className="text-sm text-gray-600 truncate leading-relaxed">{file.fileName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2.5 md:p-2 hover:bg-gray-100 active:bg-gray-200 rounded-xl md:rounded-lg transition-colors duration-150 disabled:opacity-50 min-h-[44px] min-w-[44px] flex-shrink-0 ml-2"
          >
            <X className="h-6 w-6 md:h-5 md:w-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Mobile Optimized */}
        <div className="p-6 md:p-4 overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="mb-6 md:mb-4 p-4 md:p-3 bg-red-50 border border-red-200 rounded-xl md:rounded-lg text-red-700 text-sm leading-relaxed">
              {error}
            </div>
          )}

          {!showCreateForm ? (
            <>
              {/* Current Assignment - Mobile Optimized */}
              {file.item && (
                <div className="mb-6 p-5 md:p-4 bg-blue-50 border border-blue-200 rounded-xl md:rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Currently tagged to:</p>
                      <p className="text-base md:text-sm text-blue-700 font-medium">{file.item.itemName}</p>
                    </div>
                    <Button
                      onClick={() => handleTagToItem(null)}
                      variant="secondary"
                      size="small"
                      loading={loading}
                      className="text-blue-700 hover:text-blue-800 w-full sm:w-auto"
                    >
                      Remove Tag
                    </Button>
                  </div>
                </div>
              )}

              {/* Search Bar - Mobile Optimized */}
              <div className="mb-6 md:mb-4">
                <Input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="h-5 w-5 md:h-4 md:w-4" />}
                  className="w-full"
                />
              </div>

              {/* Items List - Mobile Optimized */}
              {filteredItems.length > 0 ? (
                <div className="space-y-3 md:space-y-2 mb-6">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTagToItem(item.id)}
                      disabled={loading || file.item?.id === item.id}
                      className="w-full flex items-center gap-4 md:gap-3 p-4 md:p-3 text-left rounded-xl md:rounded-lg border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed min-h-[72px] md:min-h-[60px]"
                    >
                      <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
                        <Package className="h-5 w-5 md:h-4 md:w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-base md:text-sm leading-tight mb-1">{item.itemName}</p>
                        {item.details && (
                          <p className="text-sm text-gray-600 truncate mb-1 leading-relaxed">{item.details}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {item.files.length} file{item.files.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {file.item?.id === item.id && (
                        <div className="flex-shrink-0">
                          <div className="px-3 py-1.5 md:px-2 md:py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            Current
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No items found matching &quot;{searchTerm}&quot;</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No items available</p>
                </div>
              )}

              {/* Create New Item Button - Mobile Optimized */}
              <Button
                onClick={() => setShowCreateForm(true)}
                variant="modern"
                size="large"
                className="w-full touch-target-lg"
                disabled={loading}
              >
                <Plus className="h-5 w-5" />
                Create New Item
              </Button>
            </>
          ) : (
            <>
              {/* Create New Item Form */}
              <div className="space-y-4 mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Create New Item</h3>
                
                <Field label="Item Name" required>
                  <Input
                    type="text"
                    value={newItemForm.itemName}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, itemName: e.target.value }))}
                    placeholder="e.g., Dining Table, Sofa, Desk..."
                    className="w-full"
                  />
                </Field>

                <Field label="Details" helperText="Optional description or damage notes">
                  <Textarea
                    value={newItemForm.details}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, details: e.target.value }))}
                    placeholder="e.g., Water damage on left side, scratched surface..."
                    rows={3}
                    className="w-full"
                  />
                </Field>
              </div>

              {/* Form Actions - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleCreateAndTag}
                  variant="primary"
                  size="large"
                  loading={loading}
                  disabled={!newItemForm.itemName.trim()}
                  className="flex-1 w-full sm:w-auto touch-target-lg"
                >
                  Create & Tag File
                </Button>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="modern"
                  size="large"
                  disabled={loading}
                  className="flex-1 w-full sm:w-auto touch-target-lg"
                >
                  Back to Items
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}