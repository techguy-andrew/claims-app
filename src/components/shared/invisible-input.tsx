'use client'

import React, { useState, useCallback, useRef, useLayoutEffect } from 'react'

// ============================================================================
// INVISIBLE INPUT COMPONENT - The Secret Sauce for Seamless Inline Editing
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
  autoFocus?: boolean  // NEW: Optional auto-focus, default false
}

export const InvisibleInput: React.FC<InvisibleInputProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  isEditing,
  className = '',
  placeholder = '',
  multiline = false,
  autoSize = true,
  autoFocus = false  // Default to false - no auto-focus
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

  // Focus management with cursor positioning - only when explicitly requested
  useLayoutEffect(() => {
    if (isEditing && autoFocus && ref.current) {
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
  }, [isEditing, autoFocus])

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