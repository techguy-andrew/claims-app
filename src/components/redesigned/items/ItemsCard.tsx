'use client'

import React, { useState, useCallback, useRef, useLayoutEffect } from 'react'
import { 
  ChevronDown, 
  Package, 
  MoreVertical,
  X,
  Check,
  Edit,
  Trash2
} from 'lucide-react'
import { FilesList } from '../files/FilesList'

// ============================================================================
// TYPES
// ============================================================================

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
  onUpdate?: (item: ClaimItem) => void
  onDelete?: (itemId: string) => void
  onFileAction?: (action: string, file: ClaimFile) => void
}

// ============================================================================
// INVISIBLE INPUT COMPONENT - The Secret Sauce
// ============================================================================

interface InvisibleInputProps {
  value: string
  onChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
  isEditing: boolean
  className?: string
  placeholder?: string
  multiline?: boolean
  autoSize?: boolean
}

const InvisibleInput: React.FC<InvisibleInputProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  isEditing,
  className = '',
  placeholder = '',
  multiline = false,
  autoSize = true
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [localValue, setLocalValue] = useState(value)
  const cursorPositionRef = useRef<{ start: number; end: number } | null>(null)
  const isTypingRef = useRef(false)

  // ============================================================================
  // CURSOR POSITION UTILITIES - Professional Selection API Management
  // ============================================================================
  
  const saveCursorPosition = useCallback(() => {
    if (!ref.current || !isEditing) return
    
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    
    const range = selection.getRangeAt(0)
    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(ref.current)
    preCaretRange.setEnd(range.startContainer, range.startOffset)
    
    const start = preCaretRange.toString().length
    const end = start + range.toString().length
    
    cursorPositionRef.current = { start, end }
  }, [isEditing])

  const restoreCursorPosition = useCallback(() => {
    if (!ref.current || !cursorPositionRef.current || !isEditing) return
    
    const { start, end } = cursorPositionRef.current
    const selection = window.getSelection()
    if (!selection) return
    
    try {
      const textNodes = []
      const walk = document.createTreeWalker(
        ref.current,
        NodeFilter.SHOW_TEXT,
        null
      )
      
      let node
      while (node = walk.nextNode()) {
        textNodes.push(node)
      }
      
      let charCount = 0
      let startNode = null
      let endNode = null
      let startOffset = 0
      let endOffset = 0
      
      for (const textNode of textNodes) {
        const nodeLength = textNode.textContent?.length || 0
        
        if (!startNode && charCount + nodeLength >= start) {
          startNode = textNode
          startOffset = start - charCount
        }
        
        if (!endNode && charCount + nodeLength >= end) {
          endNode = textNode
          endOffset = end - charCount
          break
        }
        
        charCount += nodeLength
      }
      
      if (startNode) {
        const range = document.createRange()
        range.setStart(startNode, Math.min(startOffset, startNode.textContent?.length || 0))
        range.setEnd(endNode || startNode, Math.min(endOffset, (endNode || startNode).textContent?.length || 0))
        
        selection.removeAllRanges()
        selection.addRange(range)
      }
    } catch {
      // Fallback: position cursor at end
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(ref.current)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [isEditing])

  // ============================================================================
  // SMART DUAL-MODE RENDERING - No React Interference During Editing
  // ============================================================================

  // Sync external value to local state when not actively typing
  useLayoutEffect(() => {
    if (!isTypingRef.current) {
      setLocalValue(value)
    }
  }, [value])

  // Direct DOM manipulation during editing (bypasses React reconciliation)
  useLayoutEffect(() => {
    if (!ref.current) return
    
    if (isEditing) {
      // Save cursor before any DOM manipulation
      saveCursorPosition()
      
      // Direct DOM update - React hands off control
      const currentText = ref.current.textContent || ''
      if (currentText !== localValue) {
        ref.current.textContent = localValue
        
        // Restore cursor after DOM update
        requestAnimationFrame(() => {
          restoreCursorPosition()
        })
      }
      
      // Handle placeholder display
      if (!localValue && placeholder) {
        ref.current.setAttribute('data-placeholder', placeholder)
        ref.current.classList.add('empty-placeholder')
      } else {
        ref.current.classList.remove('empty-placeholder')
      }
    }
  }, [localValue, isEditing, placeholder, saveCursorPosition, restoreCursorPosition])

  // Auto-resize for multiline (avoid during active typing)
  useLayoutEffect(() => {
    if (multiline && autoSize && ref.current && !isTypingRef.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = ref.current.scrollHeight + 'px'
    }
  }, [localValue, multiline, autoSize])

  // Focus management with cursor positioning
  useLayoutEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus()
      
      // Position cursor at end for initial focus
      if (!cursorPositionRef.current) {
        const range = document.createRange()
        const selection = window.getSelection()
        range.selectNodeContents(ref.current)
        range.collapse(false)
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }
  }, [isEditing])

  // ============================================================================
  // EVENT HANDLERS - Optimized for Cursor Stability
  // ============================================================================

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    if (!isEditing) return
    
    isTypingRef.current = true
    const newValue = e.currentTarget.textContent || ''
    
    // Save cursor position before state updates
    saveCursorPosition()
    
    // Update local state immediately (no React re-render issues)
    setLocalValue(newValue)
    
    // Debounced parent callback to reduce re-renders
    const timeoutId = setTimeout(() => {
      onChange(newValue)
      isTypingRef.current = false
    }, 16) // ~60fps debounce
    
    return () => clearTimeout(timeoutId)
  }, [isEditing, onChange, saveCursorPosition])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    } else if (e.key === 'Enter') {
      if (!multiline) {
        e.preventDefault()
        onSave()
      } else if (e.metaKey || e.ctrlKey) {
        e.preventDefault()
        onSave()
      }
    }
  }, [multiline, onSave, onCancel])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    
    // Save cursor position
    saveCursorPosition()
    
    // Use native API for better cursor handling
    if (document.execCommand) {
      document.execCommand('insertText', false, text)
    } else {
      // Modern browsers fallback
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        range.insertNode(document.createTextNode(text))
        range.collapse(false)
      }
    }
  }, [saveCursorPosition])

  // ============================================================================
  // RENDER - Clean Separation Between Edit and Display Modes
  // ============================================================================

  return (
    <div
      ref={ref}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onBlur={() => { isTypingRef.current = false }}
      className={`${className} ${
        isEditing 
          ? 'outline-none focus:outline-none cursor-text' 
          : 'cursor-default'
      }`}
      role={isEditing ? 'textbox' : undefined}
      aria-label={isEditing ? 'Edit field' : undefined}
      spellCheck={false}
      style={{
        WebkitUserSelect: isEditing ? 'text' : 'none',
        userSelect: isEditing ? 'text' : 'none',
        WebkitTapHighlightColor: 'transparent',
        minHeight: multiline ? '1.5em' : undefined,
        whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
        wordBreak: 'break-word'
      }}
      // Only use dangerouslySetInnerHTML in display mode
      {...(!isEditing && { 
        dangerouslySetInnerHTML: { 
          __html: localValue || `<span class="text-gray-400 italic">${placeholder}</span>`
        } 
      })}
    />
  )
}

// ============================================================================
// FLOATING TOAST COMPONENT
// ============================================================================

const Toast: React.FC<{ message: string; visible: boolean }> = ({ message, visible }) => (
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

export function ItemsCard({ item, claimId, onUpdate, onDelete, onFileAction }: ItemsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draftData, setDraftData] = useState({
    itemName: item.itemName,
    details: item.details || ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null)
  
  // Store scroll position without external dependencies
  const scrollPosRef = useRef(0)
  const menuButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  const enterEditMode = useCallback(() => {
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

  // Floating Context Menu Component
  const FloatingContextMenu = () => {
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
          onClick={() => handleActionMenuAction('edit')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/80 transition-colors duration-150 text-left text-gray-900"
        >
          <Edit className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">Edit Item</span>
        </button>
        
        <button
          onClick={() => handleActionMenuAction('delete')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50/80 transition-colors duration-150 text-left text-red-600"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Delete</span>
        </button>
      </div>
    )
  }

  // Toggle floating menu and calculate position
  const toggleFloatingMenu = useCallback((itemId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation() // Prevent event bubbling to header click handler
    
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
  const handleActionMenuAction = useCallback((action: string) => {
    setActiveActionMenu(null)
    setMenuPosition(null)
    
    switch (action) {
      case 'edit':
        enterEditMode()
        break
      case 'delete':
        onDelete?.(item.id)
        break
    }
  }, [enterEditMode, onDelete, item.id])

  // Close floating menu when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Element
    if (!target.closest('.floating-menu') && !target.closest('.menu-button')) {
      setActiveActionMenu(null)
      setMenuPosition(null)
    }
  }, [])

  // Setup click outside listener
  useLayoutEffect(() => {
    if (activeActionMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [activeActionMenu, handleClickOutside])

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
            if (hasFiles && !isEditing) {
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
            <InvisibleInput
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
                
                <button
                  ref={(el) => { menuButtonRefs.current[item.id] = el }}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFloatingMenu(item.id, e)
                  }}
                  className="menu-button w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  title="More actions"
                >
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                  title="Cancel"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-blue-50 transition-colors"
                  title="Save"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  ) : (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-100">
            {/* Description */}
            <div className="p-4 border-b border-gray-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
              <InvisibleInput
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
                <FilesList
                  files={item.files}
                  onFileAction={(action, file) => {
                    if (action === 'tag') {
                      onFileAction?.('untag', file)
                    } else {
                      onFileAction?.(action, file)
                    }
                  }}
                  emptyStateText="No files tagged to this item"
                  showThumbnails={true}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Context Menu */}
      <FloatingContextMenu />

      {/* Toast Notification */}
      <Toast message="Changes saved" visible={showToast} />
    </>
  )
}