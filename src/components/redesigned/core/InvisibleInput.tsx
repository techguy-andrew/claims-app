'use client'

import React, { useState, useCallback, useRef, useLayoutEffect } from 'react'
import styles from './InvisibleInput.module.css'

// ============================================================================
// TYPES
// ============================================================================

export interface InvisibleInputProps {
  value: string
  onChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
  isEditing: boolean
  className?: string
  placeholder?: string
  multiline?: boolean
  autoSize?: boolean
  variant?: 'default' | 'title' | 'description' | 'small'
  disabled?: boolean
}

// ============================================================================
// INVISIBLE INPUT COMPONENT - Professional ContentEditable Implementation
// ============================================================================

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
  variant = 'default',
  disabled = false
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [localValue, setLocalValue] = useState(value)
  const cursorPositionRef = useRef<{ start: number; end: number } | null>(null)
  const isTypingRef = useRef(false)

  // ============================================================================
  // CURSOR POSITION UTILITIES - Professional Selection API Management
  // ============================================================================
  
  const saveCursorPosition = useCallback(() => {
    if (!ref.current || !isEditing || disabled) return
    
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    
    const range = selection.getRangeAt(0)
    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(ref.current)
    preCaretRange.setEnd(range.startContainer, range.startOffset)
    
    const start = preCaretRange.toString().length
    const end = start + range.toString().length
    
    cursorPositionRef.current = { start, end }
  }, [isEditing, disabled])

  const restoreCursorPosition = useCallback(() => {
    if (!ref.current || !cursorPositionRef.current || !isEditing || disabled) return
    
    const { start, end } = cursorPositionRef.current
    const selection = window.getSelection()
    if (!selection) return
    
    try {
      const textNodes: Text[] = []
      const walk = document.createTreeWalker(
        ref.current,
        NodeFilter.SHOW_TEXT,
        null
      )
      
      let node
      while (node = walk.nextNode()) {
        textNodes.push(node as Text)
      }
      
      let charCount = 0
      let startNode: Text | null = null
      let endNode: Text | null = null
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
      if (ref.current) {
        range.selectNodeContents(ref.current)
        range.collapse(false)
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }
  }, [isEditing, disabled])

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
    
    if (isEditing && !disabled) {
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
        ref.current.classList.add(styles.emptyPlaceholder)
      } else {
        ref.current.classList.remove(styles.emptyPlaceholder)
      }
    }
  }, [localValue, isEditing, placeholder, disabled, saveCursorPosition, restoreCursorPosition])

  // Auto-resize for multiline (avoid during active typing)
  useLayoutEffect(() => {
    if (multiline && autoSize && ref.current && !isTypingRef.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = ref.current.scrollHeight + 'px'
    }
  }, [localValue, multiline, autoSize])

  // Focus management with cursor positioning
  useLayoutEffect(() => {
    if (isEditing && ref.current && !disabled) {
      ref.current.focus()
      
      // Position cursor at end for initial focus
      if (!cursorPositionRef.current) {
        const range = document.createRange()
        const selection = window.getSelection()
        if (ref.current) {
          range.selectNodeContents(ref.current)
          range.collapse(false)
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      }
    }
  }, [isEditing, disabled])

  // ============================================================================
  // EVENT HANDLERS - Optimized for Cursor Stability
  // ============================================================================

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    if (!isEditing || disabled) return
    
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
  }, [isEditing, disabled, onChange, saveCursorPosition])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return
    
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
  }, [multiline, disabled, onSave, onCancel])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (disabled) return
    
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
  }, [disabled, saveCursorPosition])

  const handleBlur = useCallback(() => {
    isTypingRef.current = false
  }, [])

  // ============================================================================
  // RENDER - Clean Separation Between Edit and Display Modes
  // ============================================================================

  const combinedClassName = [
    styles.invisibleInput,
    styles[variant],
    isEditing ? styles.editing : styles.display,
    disabled ? styles.disabled : '',
    multiline ? styles.multiline : styles.singleline,
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      contentEditable={isEditing && !disabled}
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onBlur={handleBlur}
      className={combinedClassName}
      role={isEditing ? 'textbox' : undefined}
      aria-label={isEditing ? 'Edit field' : undefined}
      aria-multiline={multiline}
      aria-disabled={disabled}
      spellCheck={false}
      style={{
        WebkitUserSelect: isEditing && !disabled ? 'text' : 'none',
        userSelect: isEditing && !disabled ? 'text' : 'none',
        WebkitTapHighlightColor: 'transparent',
        minHeight: multiline ? '1.5em' : undefined,
        whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
        wordBreak: 'break-word'
      }}
      // Only use dangerouslySetInnerHTML in display mode
      {...(!isEditing && { 
        dangerouslySetInnerHTML: { 
          __html: localValue || `<span class="${styles.placeholderText}">${placeholder}</span>`
        } 
      })}
    />
  )
}

// ============================================================================
// SPECIALIZED VARIANTS
// ============================================================================

export const InvisibleTextInput: React.FC<Omit<InvisibleInputProps, 'multiline'>> = (props) => (
  <InvisibleInput {...props} multiline={false} variant="default" />
)

export const InvisibleTextArea: React.FC<Omit<InvisibleInputProps, 'multiline'>> = (props) => (
  <InvisibleInput {...props} multiline={true} variant="description" />
)

export const InvisibleTitle: React.FC<Omit<InvisibleInputProps, 'multiline' | 'variant'>> = (props) => (
  <InvisibleInput {...props} multiline={false} variant="title" />
)

export const InvisibleDescription: React.FC<Omit<InvisibleInputProps, 'multiline' | 'variant'>> = (props) => (
  <InvisibleInput {...props} multiline={true} variant="description" />
)