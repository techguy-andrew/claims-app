'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  RotateCw, 
  Maximize2, 
  Minimize2,
  Share,
  Heart,
  Info
} from 'lucide-react'
import { Button } from '../ui/Button'
import { useIsomorphicLayoutEffect } from '../../../hooks/useIsomorphicLayoutEffect'
import { PhotoFile } from './PhotoUpload'
import styles from './PhotoViewer.module.css'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PhotoViewerProps {
  photos: PhotoFile[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
  onDelete?: (photo: PhotoFile, index: number) => void
  onShare?: (photo: PhotoFile, index: number) => void
  onFavorite?: (photo: PhotoFile, index: number) => void
  showControls?: boolean
  showThumbnails?: boolean
  showInfo?: boolean
  allowDelete?: boolean
  className?: string
}

interface ViewerAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick: (photo: PhotoFile, index: number) => void
  disabled?: boolean
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
// PHOTO VIEWER COMPONENT
// ============================================================================

export const PhotoViewer: React.FC<PhotoViewerProps> = ({
  photos,
  initialIndex = 0,
  isOpen,
  onClose,
  onDelete,
  onShare,
  onFavorite,
  showControls = true,
  showThumbnails = true,
  showInfo = false,
  allowDelete = false,
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPhotoInfo, setShowPhotoInfo] = useState(showInfo)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Reset state when viewer opens/closes or photos change
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.min(initialIndex, photos.length - 1))
      setIsZoomed(false)
      setRotation(0)
      setImageLoaded(false)
      setImageError(false)
    }
  }, [isOpen, initialIndex, photos.length])

  // Reset image state when photo changes
  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [currentIndex])

  // Keyboard navigation
  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowLeft':
          event.preventDefault()
          goToPrevious()
          break
        case 'ArrowRight':
          event.preventDefault()
          goToNext()
          break
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
          setShowPhotoInfo(!showPhotoInfo)
          break
        case 'KeyF':
          event.preventDefault()
          toggleFullscreen()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, photos.length, isZoomed, showPhotoInfo])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1))
    setIsZoomed(false)
    setRotation(0)
  }, [photos.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0))
    setIsZoomed(false)
    setRotation(0)
  }, [photos.length])

  const goToPhoto = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsZoomed(false)
    setRotation(0)
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
  const downloadPhoto = useCallback(async (photo: PhotoFile) => {
    try {
      const response = await fetch(photo.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = photo.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }, [])

  // Current photo
  const currentPhoto = photos[currentIndex]
  
  // Actions
  const actions: ViewerAction[] = useMemo(() => {
    const baseActions: ViewerAction[] = [
      {
        id: 'download',
        label: 'Download',
        icon: Download,
        onClick: downloadPhoto
      },
      {
        id: 'rotate',
        label: 'Rotate',
        icon: RotateCw,
        onClick: rotateImage
      },
      {
        id: 'fullscreen',
        label: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen',
        icon: isFullscreen ? Minimize2 : Maximize2,
        onClick: toggleFullscreen
      },
      {
        id: 'info',
        label: showPhotoInfo ? 'Hide Info' : 'Show Info',
        icon: Info,
        onClick: () => setShowPhotoInfo(!showPhotoInfo)
      }
    ]

    if (onShare) {
      baseActions.unshift({
        id: 'share',
        label: 'Share',
        icon: Share,
        onClick: onShare
      })
    }

    if (onFavorite) {
      baseActions.unshift({
        id: 'favorite',
        label: 'Favorite',
        icon: Heart,
        onClick: onFavorite
      })
    }

    return baseActions
  }, [downloadPhoto, rotateImage, toggleFullscreen, isFullscreen, showPhotoInfo, onShare, onFavorite])

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
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
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  }

  if (!isOpen || photos.length === 0 || !currentPhoto) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`${styles.photoViewer} ${isFullscreen ? styles.fullscreen : ''} ${className || ''}`}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        {/* Main Modal */}
        <motion.div
          className={styles.modal}
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {showControls && (
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <span className={styles.photoCounter}>
                  {currentIndex + 1} of {photos.length}
                </span>
                <h2 className={styles.photoTitle}>{currentPhoto.name}</h2>
              </div>

              <div className={styles.headerRight}>
                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                  {actions.map((action) => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      size="small"
                      onClick={() => action.onClick(currentPhoto, currentIndex)}
                      disabled={action.disabled}
                      title={action.label}
                      leftIcon={<action.icon />}
                    />
                  ))}

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
                      title="Actual size"
                      leftIcon={<ZoomIn />}
                    />
                  </div>
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

          {/* Photo Container */}
          <div className={styles.photoContainer}>
            {/* Navigation Arrows */}
            {photos.length > 1 && (
              <>
                <motion.button
                  className={`${styles.navButton} ${styles.navPrev}`}
                  onClick={goToPrevious}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Previous photo (←)"
                >
                  <ChevronLeft className={styles.navIcon} />
                </motion.button>

                <motion.button
                  className={`${styles.navButton} ${styles.navNext}`}
                  onClick={goToNext}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Next photo (→)"
                >
                  <ChevronRight className={styles.navIcon} />
                </motion.button>
              </>
            )}

            {/* Photo Display */}
            <div className={styles.photoDisplay}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`photo-${currentIndex}`}
                  className={`${styles.photoWrapper} ${isZoomed ? styles.zoomed : ''}`}
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  onClick={toggleZoom}
                >
                  {!imageLoaded && !imageError && (
                    <div className={styles.photoLoading}>
                      <div className={styles.loadingSpinner} />
                      <span>Loading...</span>
                    </div>
                  )}

                  {imageError && (
                    <div className={styles.photoError}>
                      <span>Failed to load image</span>
                    </div>
                  )}

                  <img
                    src={currentPhoto.url}
                    alt={currentPhoto.name}
                    className={styles.photoImage}
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

            {/* Photo Info Panel */}
            <AnimatePresence>
              {showPhotoInfo && (
                <motion.div
                  className={styles.photoInfo}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className={styles.infoTitle}>Photo Details</h3>
                  <div className={styles.infoContent}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Name:</span>
                      <span className={styles.infoValue}>{currentPhoto.name}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Size:</span>
                      <span className={styles.infoValue}>{formatFileSize(currentPhoto.size)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Type:</span>
                      <span className={styles.infoValue}>{currentPhoto.type}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Uploaded:</span>
                      <span className={styles.infoValue}>{formatDate(currentPhoto.uploadedAt)}</span>
                    </div>
                    {currentPhoto.cloudinaryPublicId && (
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>ID:</span>
                        <span className={styles.infoValue}>{currentPhoto.cloudinaryPublicId}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Thumbnails */}
          {showThumbnails && photos.length > 1 && (
            <div className={styles.thumbnails}>
              <div className={styles.thumbnailsContainer}>
                {photos.map((photo, index) => (
                  <motion.button
                    key={photo.id}
                    className={`${styles.thumbnail} ${index === currentIndex ? styles.thumbnailActive : ''}`}
                    onClick={() => goToPhoto(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className={styles.thumbnailImage}
                      loading="lazy"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PhotoViewer