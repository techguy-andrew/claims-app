'use client'

import React, { useState, useCallback, useMemo, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Eye, 
  Download, 
  Trash2, 
  FileImage,
  AlertCircle,
  CheckCircle,
  MoreVertical,
  Loader2,
  Camera,
  FolderPlus
} from 'lucide-react'
import { Button } from '../ui/Button'
import { FloatingContextMenu } from '../core/FloatingContextMenu'
import { PhotoViewer } from './PhotoViewer'
import styles from './PhotoUpload.module.css'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PhotoFile {
  id: string
  file?: File
  url: string
  name: string
  size: number
  type: string
  uploadedAt: string
  cloudinaryPublicId?: string
  isUploading?: boolean
  uploadProgress?: number
  error?: string
}

export interface PhotoUploadProps {
  photos: PhotoFile[]
  onPhotosChange: (photos: PhotoFile[]) => void
  maxFiles?: number
  maxFileSize?: number // in bytes
  acceptedTypes?: string[]
  cloudinaryFolder?: string
  uploadEndpoint?: string
  onUploadProgress?: (progress: { [fileId: string]: number }) => void
  onUploadComplete?: (photo: PhotoFile) => void
  onUploadError?: (error: string, file?: File) => void
  disabled?: boolean
  compact?: boolean
  showPreview?: boolean
  allowReorder?: boolean
  className?: string
}

interface PhotoAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick: (photo: PhotoFile) => void
  variant?: 'default' | 'primary' | 'danger'
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

const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}

const generateFileId = (): string => {
  return `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// ============================================================================
// PHOTO ITEM COMPONENT
// ============================================================================

const PhotoItem: React.FC<{
  photo: PhotoFile
  index: number
  onView: (photo: PhotoFile, index: number) => void
  onDelete: (photo: PhotoFile) => void
  onRetry: (photo: PhotoFile) => void
  actions?: PhotoAction[]
  showActions?: boolean
}> = ({ photo, index, onView, onDelete, onRetry, actions = [], showActions = true }) => {
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null)

  const defaultActions: PhotoAction[] = useMemo(() => [
    {
      id: 'view',
      label: 'View Full Size',
      icon: Eye,
      onClick: (photo) => onView(photo, index),
      variant: 'primary'
    },
    {
      id: 'download',
      label: 'Download',
      icon: Download,
      onClick: async (photo) => {
        try {
          const link = document.createElement('a')
          link.href = photo.url
          link.download = photo.name
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } catch (error) {
          console.error('Download failed:', error)
        }
      }
    },
    {
      id: 'delete',
      label: 'Delete Photo',
      icon: Trash2,
      onClick: onDelete,
      variant: 'danger'
    }
  ], [index, onView, onDelete])

  const allActions = [...defaultActions, ...actions]

  const handleActionsClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const rect = event.currentTarget.getBoundingClientRect()
    
    const top = rect.bottom + 8
    const right = window.innerWidth - rect.right

    setMenuPosition({ top, right })
    setShowActionsMenu(!showActionsMenu)
  }, [showActionsMenu])

  const closeActionsMenu = useCallback(() => {
    setShowActionsMenu(false)
    setMenuPosition(null)
  }, [])

  const handleActionClick = useCallback((action: PhotoAction) => {
    action.onClick(photo)
    closeActionsMenu()
  }, [photo, closeActionsMenu])

  return (
    <motion.div
      className={`${styles.photoItem} ${photo.isUploading ? styles.uploading : ''} ${photo.error ? styles.error : ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      layout
    >
      {/* Photo Preview */}
      <div 
        className={styles.photoPreview}
        onClick={() => !photo.isUploading && !photo.error && onView(photo, index)}
        role="button"
        tabIndex={0}
      >
        {photo.isUploading ? (
          <div className={styles.uploadingState}>
            <Loader2 className={styles.uploadingIcon} />
            <span className={styles.uploadingText}>
              {photo.uploadProgress ? `${Math.round(photo.uploadProgress)}%` : 'Uploading...'}
            </span>
          </div>
        ) : photo.error ? (
          <div className={styles.errorState}>
            <AlertCircle className={styles.errorIcon} />
            <span className={styles.errorText}>Failed</span>
            <Button
              variant="ghost"
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onRetry(photo)
              }}
              className={styles.retryButton}
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <img
              src={photo.url}
              alt={photo.name}
              className={styles.photoImage}
              loading="lazy"
            />
            <div className={styles.photoOverlay}>
              <Eye className={styles.viewIcon} />
            </div>
          </>
        )}

        {/* Upload Progress Bar */}
        {photo.isUploading && photo.uploadProgress !== undefined && (
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${photo.uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </div>

      {/* Photo Info */}
      <div className={styles.photoInfo}>
        <div className={styles.photoDetails}>
          <span className={styles.photoName}>{photo.name}</span>
          <span className={styles.photoSize}>{formatFileSize(photo.size)}</span>
        </div>

        {showActions && !photo.isUploading && (
          <motion.button
            className={`${styles.actionsButton} menu-button`}
            onClick={handleActionsClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Photo actions"
          >
            <MoreVertical className={styles.actionsIcon} />
          </motion.button>
        )}
      </div>

      {/* Success Indicator */}
      {!photo.isUploading && !photo.error && (
        <motion.div
          className={styles.successIndicator}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <CheckCircle className={styles.successIcon} />
        </motion.div>
      )}

      {/* Actions Menu */}
      <FloatingContextMenu
        isVisible={showActionsMenu}
        position={menuPosition}
        onClose={closeActionsMenu}
      >
        <div className={styles.actionsMenu}>
          {allActions.map((action) => (
            <motion.button
              key={action.id}
              className={`${styles.actionItem} ${
                action.variant === 'danger' ? styles.actionDanger :
                action.variant === 'primary' ? styles.actionPrimary : ''
              }`}
              onClick={() => handleActionClick(action)}
              disabled={action.disabled}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.1 }}
            >
              <action.icon className={styles.actionIcon} />
              <span className={styles.actionLabel}>{action.label}</span>
            </motion.button>
          ))}
        </div>
      </FloatingContextMenu>
    </motion.div>
  )
}

// ============================================================================
// MAIN PHOTO UPLOAD COMPONENT
// ============================================================================

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photos,
  onPhotosChange,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  cloudinaryFolder = 'uploads',
  uploadEndpoint = '/api/upload/photos',
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  disabled = false,
  compact = false,
  showPreview = true,
  allowReorder = false,
  className
}) => {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dropzone configuration
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - photos.length,
    maxSize: maxFileSize,
    disabled,
    onDrop: handleFileDrop,
    onDropRejected: handleDropRejected
  })

  // Handle file drop
  async function handleFileDrop(acceptedFiles: File[]) {
    if (acceptedFiles.length === 0) return

    const newPhotos: PhotoFile[] = []
    const updatedPhotos = [...photos]

    // Create photo objects with uploading state
    for (const file of acceptedFiles) {
      const photoId = generateFileId()
      const newPhoto: PhotoFile = {
        id: photoId,
        file,
        url: URL.createObjectURL(file), // Temporary URL for preview
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        isUploading: true,
        uploadProgress: 0
      }
      
      newPhotos.push(newPhoto)
      updatedPhotos.push(newPhoto)
    }

    onPhotosChange(updatedPhotos)

    // Upload files
    for (const newPhoto of newPhotos) {
      try {
        await uploadPhoto(newPhoto)
      } catch (error) {
        console.error(`Upload failed for ${newPhoto.name}:`, error)
      }
    }
  }

  // Handle drop rejection
  function handleDropRejected(rejectedFiles: any[]) {
    rejectedFiles.forEach(({ file, errors }) => {
      const errorMessage = errors.map((e: any) => e.message).join(', ')
      onUploadError?.(errorMessage, file)
    })
  }

  // Upload photo to server
  async function uploadPhoto(photo: PhotoFile) {
    if (!photo.file) return

    const formData = new FormData()
    formData.append('file', photo.file)
    formData.append('folder', cloudinaryFolder)
    formData.append('fileId', photo.id)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        updatePhotoProgress(photo.id, (prev) => Math.min((prev || 0) + 10, 90))
      }, 200)

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      // Update photo with server response
      const updatedPhotos = photos.map(p => {
        if (p.id === photo.id) {
          // Clean up temporary URL
          if (p.url.startsWith('blob:')) {
            URL.revokeObjectURL(p.url)
          }

          const updatedPhoto = {
            ...p,
            url: result.secure_url || result.url,
            cloudinaryPublicId: result.public_id,
            isUploading: false,
            uploadProgress: 100,
            error: undefined
          }

          onUploadComplete?.(updatedPhoto)
          return updatedPhoto
        }
        return p
      })

      onPhotosChange(updatedPhotos)

    } catch (error) {
      console.error('Upload error:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      
      // Update photo with error state
      const updatedPhotos = photos.map(p => 
        p.id === photo.id 
          ? { ...p, isUploading: false, error: errorMessage }
          : p
      )
      
      onPhotosChange(updatedPhotos)
      onUploadError?.(errorMessage, photo.file)
    }
  }

  // Update photo upload progress
  const updatePhotoProgress = useCallback((photoId: string, progressUpdater: (prev: number | undefined) => number) => {
    const updatedPhotos = photos.map(p => {
      if (p.id === photoId) {
        const newProgress = progressUpdater(p.uploadProgress)
        onUploadProgress?.({ [photoId]: newProgress })
        return { ...p, uploadProgress: newProgress }
      }
      return p
    })
    onPhotosChange(updatedPhotos)
  }, [photos, onPhotosChange, onUploadProgress])

  // Retry failed upload
  const handleRetryUpload = useCallback(async (photo: PhotoFile) => {
    if (!photo.file) return

    const updatedPhotos = photos.map(p => 
      p.id === photo.id 
        ? { ...p, isUploading: true, error: undefined, uploadProgress: 0 }
        : p
    )
    
    onPhotosChange(updatedPhotos)
    await uploadPhoto(photo)
  }, [photos, onPhotosChange])

  // Delete photo
  const handleDeletePhoto = useCallback((photoToDelete: PhotoFile) => {
    // Clean up blob URL if temporary
    if (photoToDelete.url.startsWith('blob:')) {
      URL.revokeObjectURL(photoToDelete.url)
    }

    const updatedPhotos = photos.filter(p => p.id !== photoToDelete.id)
    onPhotosChange(updatedPhotos)
  }, [photos, onPhotosChange])

  // View photo in modal
  const handleViewPhoto = useCallback((photo: PhotoFile, index: number) => {
    setViewerIndex(index)
  }, [])

  // Close photo viewer
  const handleCloseViewer = useCallback(() => {
    setViewerIndex(null)
  }, [])

  // Open file picker
  const handleFileInputClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Component classes
  const containerClasses = [
    styles.photoUpload,
    compact && styles.compact,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ')

  const dropzoneClasses = [
    styles.dropzone,
    isDragActive && styles.dragActive,
    isDragAccept && styles.dragAccept,
    isDragReject && styles.dragReject,
    photos.length >= maxFiles && styles.maxReached
  ].filter(Boolean).join(' ')

  const uploadingCount = photos.filter(p => p.isUploading).length
  const errorCount = photos.filter(p => p.error).length
  const canUpload = photos.length < maxFiles && !disabled

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <Camera className={styles.headerIconSvg} />
          </div>
          <div className={styles.headerContent}>
            <h3 className={styles.headerTitle}>
              Photos ({photos.length}/{maxFiles})
            </h3>
            <p className={styles.headerDescription}>
              Upload photos with drag & drop or click to browse
            </p>
          </div>
        </div>
        
        {canUpload && (
          <div className={styles.headerRight}>
            <Button
              variant="primary"
              size="small"
              onClick={handleFileInputClick}
              disabled={disabled}
              leftIcon={<FolderPlus />}
            >
              Browse Files
            </Button>
          </div>
        )}
      </div>

      {/* Upload Status */}
      {(uploadingCount > 0 || errorCount > 0) && (
        <motion.div
          className={styles.statusBar}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          {uploadingCount > 0 && (
            <div className={styles.statusItem}>
              <Loader2 className={styles.statusIcon} />
              <span>Uploading {uploadingCount} photo{uploadingCount !== 1 ? 's' : ''}...</span>
            </div>
          )}
          
          {errorCount > 0 && (
            <div className={`${styles.statusItem} ${styles.statusError}`}>
              <AlertCircle className={styles.statusIcon} />
              <span>{errorCount} upload{errorCount !== 1 ? 's' : ''} failed</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Dropzone */}
      {canUpload && (
        <motion.div
          {...getRootProps()}
          className={dropzoneClasses}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <input {...getInputProps()} ref={fileInputRef} />
          <div className={styles.dropzoneContent}>
            <div className={styles.dropzoneIcon}>
              {isDragActive ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Upload className={styles.dropzoneIconSvg} />
                </motion.div>
              ) : (
                <ImageIcon className={styles.dropzoneIconSvg} />
              )}
            </div>
            
            <div className={styles.dropzoneText}>
              <p className={styles.dropzoneTitle}>
                {isDragActive 
                  ? 'Drop photos here...' 
                  : 'Drag photos here or click to browse'
                }
              </p>
              <p className={styles.dropzoneSubtext}>
                Supports JPEG, PNG, GIF, WebP • Max {formatFileSize(maxFileSize)} each
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Photos Grid */}
      {photos.length > 0 && showPreview && (
        <div className={styles.photosGrid}>
          <AnimatePresence mode="popLayout">
            {photos.map((photo, index) => (
              <PhotoItem
                key={photo.id}
                photo={photo}
                index={index}
                onView={handleViewPhoto}
                onDelete={handleDeletePhoto}
                onRetry={handleRetryUpload}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && !canUpload && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <ImageIcon className={styles.emptyStateIconSvg} />
          </div>
          <h3 className={styles.emptyStateTitle}>No photos uploaded</h3>
          <p className={styles.emptyStateDescription}>
            Photos will appear here when uploaded
          </p>
        </div>
      )}

      {/* Photo Viewer Modal */}
      {viewerIndex !== null && (
        <PhotoViewer
          photos={photos.filter(p => !p.isUploading && !p.error)}
          initialIndex={viewerIndex}
          isOpen={viewerIndex !== null}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  )
}

export default PhotoUpload