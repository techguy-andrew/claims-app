'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Download, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  Minimize2,
  Share,
  Info
} from 'lucide-react'
import { Button } from '../ui/Button'
import { useIsomorphicLayoutEffect } from '../../../hooks/useIsomorphicLayoutEffect'
import { ClaimFile } from '../types/claim.types'
import styles from './ImageModal.module.css'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ImageModalProps {
  file: ClaimFile | null
  isOpen: boolean
  onClose: () => void
  onShare?: (file: ClaimFile) => void
  showControls?: boolean
  showInfo?: boolean
  allowDownload?: boolean
  className?: string
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ============================================================================
// IMAGE MODAL COMPONENT
// ============================================================================

export const ImageModal: React.FC<ImageModalProps> = ({
  file,
  isOpen,
  onClose,
  onShare,
  showControls = true,
  showInfo = false,
  allowDownload = true,
  className
}) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showImageInfo, setShowImageInfo] = useState(showInfo)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Reset state when modal opens/closes or file changes
  useEffect(() => {
    if (isOpen && file) {
      setIsZoomed(false)
      setRotation(0)
      setImageLoaded(false)
      setImageError(false)
      setShowImageInfo(showInfo)
    }
  }, [isOpen, file, showInfo])

  // Body scroll lock
  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'auto'
      }
    }
  }, [isOpen])

  // Keyboard navigation
  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Escape':
          event.preventDefault()
          onClose()
          break
        case 'Space':
          event.preventDefault()
          toggleZoom()
          break
        case 'KeyR':
          event.preventDefault()
          rotateImage()
          break
        case 'KeyI':
          event.preventDefault()
          setShowImageInfo(!showImageInfo)
          break
        case 'KeyF':
          event.preventDefault()
          toggleFullscreen()
          break
        case 'KeyD':
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault()
            if (allowDownload) downloadImage()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isZoomed, showImageInfo, allowDownload])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Zoom functions
  const toggleZoom = useCallback(() => {
    setIsZoomed(!isZoomed)
  }, [isZoomed])

  // Rotation function
  const rotateImage = useCallback(() => {
    setRotation(prev => (prev + 90) % 360)
  }, [])

  // Fullscreen function
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error)
    }
  }, [isFullscreen])

  // Download function
  const downloadImage = useCallback(async () => {
    if (!file || !allowDownload) return

    try {
      const response = await fetch(`/api/download/${file.id}`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }, [file, allowDownload])

  // Open in new tab
  const openInNewTab = useCallback(() => {
    if (!file) return
    window.open(file.fileUrl, '_blank')
  }, [file])

  // Share function
  const handleShare = useCallback(() => {
    if (file && onShare) {
      onShare(file)
    }
  }, [file, onShare])

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, scale: 0.9 }
  }

  if (!isOpen || !file || file.fileType !== 'image') return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`${styles.imageModal} ${isFullscreen ? styles.fullscreen : ''} ${className || ''}`}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        {/* Header */}
        {showControls && (
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h3 className={styles.imageTitle}>{file.fileName}</h3>
              <span className={styles.imageSize}>
                {formatFileSize(file.fileSize || 0)}
              </span>
            </div>

            <div className={styles.headerRight}>
              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                {onShare && (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={handleShare}
                    title="Share image"
                    leftIcon={<Share />}
                  />
                )}

                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setShowImageInfo(!showImageInfo)}
                  title={showImageInfo ? 'Hide info (I)' : 'Show info (I)'}
                  leftIcon={<Info />}
                />

                <Button
                  variant="ghost"
                  size="small"
                  onClick={rotateImage}
                  title="Rotate image (R)"
                  leftIcon={<RotateCw />}
                />

                <Button
                  variant="ghost"
                  size="small"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
                  leftIcon={isFullscreen ? <Minimize2 /> : <Maximize2 />}
                />

                {allowDownload && (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={downloadImage}
                    title="Download image (⌘+D)"
                    leftIcon={<Download />}
                  />
                )}

                <Button
                  variant="ghost"
                  size="small"
                  onClick={openInNewTab}
                  title="Open in new tab"
                  leftIcon={<ExternalLink />}
                />
              </div>

              {/* Zoom Controls */}
              <div className={styles.zoomControls}>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setIsZoomed(false)}
                  disabled={!isZoomed}
                  title="Fit to screen"
                  leftIcon={<ZoomOut />}
                />
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setIsZoomed(true)}
                  disabled={isZoomed}
                  title="Actual size (Space)"
                  leftIcon={<ZoomIn />}
                />
              </div>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="small"
                onClick={onClose}
                title="Close (Esc)"
                leftIcon={<X />}
              />
            </div>
          </div>
        )}

        {/* Image Container */}
        <motion.div
          className={styles.imageContainer}
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.imageDisplay}>
            {!imageLoaded && !imageError && (
              <div className={styles.imageLoading}>
                <div className={styles.loadingSpinner} />
                <span>Loading image...</span>
              </div>
            )}

            {imageError && (
              <div className={styles.imageError}>
                <span>Failed to load image</span>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => {
                    setImageError(false)
                    setImageLoaded(false)
                  }}
                >
                  Retry
                </Button>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={`image-${file.id}`}
                className={`${styles.imageWrapper} ${isZoomed ? styles.zoomed : ''}`}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={toggleZoom}
              >
                <img
                  src={file.fileUrl}
                  alt={file.fileName}
                  className={styles.image}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    cursor: isZoomed ? 'zoom-out' : 'zoom-in'
                  }}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Image Info Panel */}
          <AnimatePresence>
            {showImageInfo && (
              <motion.div
                className={styles.imageInfo}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className={styles.infoTitle}>Image Details</h4>
                <div className={styles.infoContent}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Name:</span>
                    <span className={styles.infoValue}>{file.fileName}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Size:</span>
                    <span className={styles.infoValue}>{formatFileSize(file.fileSize || 0)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Type:</span>
                    <span className={styles.infoValue}>{file.fileType}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Uploaded:</span>
                    <span className={styles.infoValue}>{formatDate(file.uploadedAt)}</span>
                  </div>
                  {file.item && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Tagged to:</span>
                      <span className={styles.infoValue}>{file.item.itemName}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ImageModal