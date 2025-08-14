'use client'

import { useEffect } from 'react'
import { X, Download, ExternalLink } from 'lucide-react'
import { ClaimFile } from '../types/claim.types'
import styles from './ImageModal.module.css'

// ============================================================================
// TYPES - Exact match to SimpleImageModal
// ============================================================================

interface ImageModalProps {
  file: ClaimFile | null
  isOpen: boolean
  onClose: () => void
}

// ============================================================================
// IMAGE MODAL - Exact SimpleImageModal functionality with CSS Modules
// ============================================================================

export function ImageModal({ file, isOpen, onClose }: ImageModalProps) {
  // Handle escape key - Exact same implementation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  // Early return - Exact same logic
  if (!isOpen || !file || file.fileType !== 'image') {
    return null
  }

  // Handle download - Exact same implementation
  const handleDownload = async () => {
    try {
      const link = document.createElement('a')
      link.href = `/api/download/${file.id}`
      link.download = file.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  // Handle open in new tab - Exact same implementation
  const handleOpenInNewTab = () => {
    window.open(file.fileUrl, '_blank')
  }

  return (
    <div className={styles.overlay}>
      {/* Header - Exact same structure and functionality */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h3 className={styles.title}>{file.fileName}</h3>
          </div>
          
          <div className={styles.actions}>
            <button
              onClick={handleDownload}
              className={styles.actionButton}
              title="Download image"
            >
              <Download className={styles.actionIcon} />
            </button>
            <button
              onClick={handleOpenInNewTab}
              className={styles.actionButton}
              title="Open in new tab"
            >
              <ExternalLink className={styles.actionIcon} />
            </button>
            <button
              onClick={onClose}
              className={styles.actionButton}
            >
              <X className={styles.actionIcon} />
            </button>
          </div>
        </div>
      </div>

      {/* Image Display - Exact same structure */}
      <div className={styles.imageContainer}>
        <img
          src={file.fileUrl}
          alt={file.fileName}
          className={styles.image}
        />
      </div>

      {/* Click outside to close - Exact same implementation */}
      <div 
        className={styles.clickOutside} 
        onClick={onClose}
      />
    </div>
  )
}