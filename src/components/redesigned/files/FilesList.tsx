'use client'

import React, { useState, useCallback, useRef, useLayoutEffect } from 'react'
import { MoreVertical, Eye, Download, Tag, Trash2, FileText, File } from 'lucide-react'
import { ClaimFile } from '../types/claim.types'
import { FloatingContextMenu } from '../core/FloatingContextMenu'
import styles from './FilesList.module.css'

// ============================================================================
// TYPES
// ============================================================================

interface FilesListProps {
  files: ClaimFile[]
  onFileAction?: (action: 'view' | 'download' | 'tag' | 'delete', file: ClaimFile) => void
  loading?: string | null
  emptyStateText?: string
  showThumbnails?: boolean
  className?: string
}

interface FileItemMenuAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  action: 'view' | 'download' | 'tag' | 'delete'
  variant?: 'default' | 'danger'
}

// ============================================================================
// FLOATING CONTEXT MENU COMPONENT
// ============================================================================

const FileFloatingMenu: React.FC<{
  file: ClaimFile
  isVisible: boolean
  position: { top: number; right: number } | null
  onAction: (action: 'view' | 'download' | 'tag' | 'delete', file: ClaimFile) => void
  onClose: () => void
}> = ({ file, isVisible, position, onAction, onClose }) => {
  const menuActions: FileItemMenuAction[] = [
    {
      id: 'view',
      label: 'View',
      icon: Eye,
      action: 'view',
      variant: 'default'
    },
    {
      id: 'tag',
      label: 'Tag Item',
      icon: Tag,
      action: 'tag',
      variant: 'default'
    },
    {
      id: 'download',
      label: 'Download',
      icon: Download,
      action: 'download',
      variant: 'default'
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      action: 'delete',
      variant: 'danger'
    }
  ]

  const handleAction = useCallback((action: FileItemMenuAction['action']) => {
    onAction(action, file)
    onClose()
  }, [file, onAction, onClose])

  return (
    <FloatingContextMenu
      isVisible={isVisible}
      position={position}
      onClose={onClose}
      className={styles.fileMenu}
    >
      {menuActions.map((menuAction) => {
        const IconComponent = menuAction.icon
        return (
          <button
            key={menuAction.id}
            onClick={() => handleAction(menuAction.action)}
            className={`${styles.menuItem} ${
              menuAction.variant === 'danger' ? styles.menuItemDanger : styles.menuItemDefault
            }`}
          >
            <IconComponent className={styles.menuIcon} />
            <span className={styles.menuLabel}>{menuAction.label}</span>
          </button>
        )
      })}
    </FloatingContextMenu>
  )
}

// ============================================================================
// FILE ITEM COMPONENT
// ============================================================================

const FileItem: React.FC<{
  file: ClaimFile
  showThumbnails: boolean
  loading: string | null
  onViewFile: (file: ClaimFile) => void
  onMenuToggle: (fileId: string, event: React.MouseEvent<HTMLButtonElement>) => void
  activeMenu: string | null
  menuPosition: { top: number; right: number } | null
  onFileAction: (action: 'view' | 'download' | 'tag' | 'delete', file: ClaimFile) => void
  onMenuClose: () => void
}> = ({
  file,
  showThumbnails,
  loading,
  onViewFile,
  onMenuToggle,
  activeMenu,
  menuPosition,
  onFileAction,
  onMenuClose
}) => {
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return ''
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${Math.round(bytes / Math.pow(1024, i) * 10) / 10} ${sizes[i]}`
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return FileText
      default:
        return File
    }
  }

  return (
    <div className={styles.fileItem}>
      {/* File Thumbnail */}
      {showThumbnails && (
        <div className={styles.thumbnailContainer}>
          <div 
            className={styles.thumbnail}
            onClick={() => onViewFile(file)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onViewFile(file)
              }
            }}
          >
            {file.fileType === 'image' ? (
              <img
                src={file.fileUrl}
                alt={file.fileName}
                className={styles.thumbnailImage}
                loading="lazy"
              />
            ) : (
              <div className={styles.thumbnailIcon}>
                {React.createElement(getFileIcon(file.fileType), {
                  className: styles.fileIcon
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Info */}
      <div className={styles.fileInfo}>
        <h4 className={styles.fileName} title={file.fileName}>
          {file.fileName}
        </h4>
        <div className={styles.fileMeta}>
          <span className={styles.fileDetails}>
            {new Date(file.uploadedAt).toLocaleDateString()} • {file.fileType.toUpperCase()}
            {file.fileSize && ` • ${formatFileSize(file.fileSize)}`}
          </span>
          {file.item && (
            <span className={styles.tagBadge}>
              <Tag className={styles.tagIcon} />
              {file.item.itemName}
            </span>
          )}
        </div>
      </div>

      {/* Menu Button */}
      <div className={styles.menuButtonContainer}>
        <button
          ref={menuButtonRef}
          onClick={(e) => onMenuToggle(file.id, e)}
          disabled={loading === file.id}
          className={`${styles.menuButton} menu-button`}
          title="More actions"
          aria-label={`File actions for ${file.fileName}`}
        >
          {loading === file.id ? (
            <div className={styles.loadingSpinner} />
          ) : (
            <MoreVertical className={styles.menuButtonIcon} />
          )}
        </button>

        {/* Floating Context Menu */}
        <FileFloatingMenu
          file={file}
          isVisible={activeMenu === file.id}
          position={menuPosition}
          onAction={onFileAction}
          onClose={onMenuClose}
        />
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const FilesList: React.FC<FilesListProps> = ({
  files,
  onFileAction,
  loading = null,
  emptyStateText = "No files available",
  showThumbnails = true,
  className = ""
}) => {
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null)

  // Sort files by most recent first
  const sortedFiles = [...files].sort((a, b) => 
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  )

  // Toggle floating menu and calculate position
  const toggleFloatingMenu = useCallback((fileId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    
    if (activeActionMenu === fileId) {
      setActiveActionMenu(null)
      setMenuPosition(null)
      return
    }

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const menuWidth = 160
    const menuHeight = 140 // Approximate height for 4 menu items
    
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
    setActiveActionMenu(fileId)
  }, [activeActionMenu])

  // Handle file action
  const handleFileAction = useCallback((action: 'view' | 'download' | 'tag' | 'delete', file: ClaimFile) => {
    setActiveActionMenu(null)
    setMenuPosition(null)
    onFileAction?.(action, file)
  }, [onFileAction])

  // Handle file view action
  const handleViewFile = useCallback((file: ClaimFile) => {
    if (file.fileType === 'image') {
      onFileAction?.('view', file)
    } else if (file.fileType === 'pdf') {
      onFileAction?.('view', file)
    } else {
      window.open(file.fileUrl, '_blank')
    }
  }, [onFileAction])

  // Close menu
  const handleMenuClose = useCallback(() => {
    setActiveActionMenu(null)
    setMenuPosition(null)
  }, [])

  // Close floating menu when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Element
    if (!target.closest('.floating-menu') && !target.closest('.menu-button')) {
      handleMenuClose()
    }
  }, [handleMenuClose])

  // Setup click outside listener
  useLayoutEffect(() => {
    if (activeActionMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [activeActionMenu, handleClickOutside])

  // Empty state
  if (sortedFiles.length === 0) {
    return (
      <div className={`${styles.emptyState} ${className}`}>
        <div className={styles.emptyStateContent}>
          <div className={styles.emptyStateIcon}>
            <File className={styles.emptyStateIconSvg} />
          </div>
          <p className={styles.emptyStateText}>{emptyStateText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.filesContainer} ${className}`}>
      <div className={styles.filesList}>
        {sortedFiles.map((file, index) => (
          <React.Fragment key={file.id}>
            <FileItem
              file={file}
              showThumbnails={showThumbnails}
              loading={loading}
              onViewFile={handleViewFile}
              onMenuToggle={toggleFloatingMenu}
              activeMenu={activeActionMenu}
              menuPosition={menuPosition}
              onFileAction={handleFileAction}
              onMenuClose={handleMenuClose}
            />
            {index !== sortedFiles.length - 1 && <div className={styles.fileDivider} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default FilesList