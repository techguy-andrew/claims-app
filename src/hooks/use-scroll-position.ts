'use client'

import { useState, useCallback, useRef } from 'react'

export interface ScrollPosition {
  x: number
  y: number
}

export interface UseScrollPositionReturn {
  captureScrollPosition: () => void
  restoreScrollPosition: () => void
  clearScrollPosition: () => void
  hasStoredPosition: boolean
  currentPosition: ScrollPosition | null
}

export function useScrollPosition(): UseScrollPositionReturn {
  const [storedPosition, setStoredPosition] = useState<ScrollPosition | null>(null)
  const restoreTimeoutRef = useRef<NodeJS.Timeout>()

  const captureScrollPosition = useCallback(() => {
    const position: ScrollPosition = {
      x: window.scrollX,
      y: window.scrollY
    }
    setStoredPosition(position)
  }, [])

  const restoreScrollPosition = useCallback(() => {
    if (storedPosition) {
      // Clear any pending restore operation
      if (restoreTimeoutRef.current) {
        clearTimeout(restoreTimeoutRef.current)
      }

      // Use requestAnimationFrame to ensure DOM updates are complete
      requestAnimationFrame(() => {
        // Add a small delay to ensure any layout changes are complete
        restoreTimeoutRef.current = setTimeout(() => {
          window.scrollTo({
            left: storedPosition.x,
            top: storedPosition.y,
            behavior: 'instant' // Use instant for exact position restoration
          })
        }, 10)
      })
    }
  }, [storedPosition])

  const clearScrollPosition = useCallback(() => {
    setStoredPosition(null)
    if (restoreTimeoutRef.current) {
      clearTimeout(restoreTimeoutRef.current)
    }
  }, [])

  return {
    captureScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
    hasStoredPosition: storedPosition !== null,
    currentPosition: storedPosition
  }
}