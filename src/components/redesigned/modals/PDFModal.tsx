'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Download, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  Share,
  Info,
  FileText,
  ChevronLeft,
  ChevronRight,
  RotateCw
} from 'lucide-react'
import { Button } from '../ui/Button'
import { useIsomorphicLayoutEffect } from '../../../hooks/useIsomorphicLayoutEffect'
import { ClaimFile } from '../types/claim.types'
import styles from './PDFModal.module.css'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PDFModalProps {
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
// PDF MODAL COMPONENT
// ============================================================================

export const PDFModal: React.FC<PDFModalProps> = ({
  file,
  isOpen,
  onClose,
  onShare,
  showControls = true,
  showInfo = false,
  allowDownload = true,
  className
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPDFInfo, setShowPDFInfo] = useState(showInfo)
  const [pdfLoaded, setPdfLoaded] = useState(false)
  const [pdfError, setPdfError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(100)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Reset state when modal opens/closes or file changes
  useEffect(() => {
    if (isOpen && file) {
      setPdfLoaded(false)
      setPdfError(false)
      setShowPDFInfo(showInfo)
      setCurrentPage(1)
      setTotalPages(0)
      setZoomLevel(100)
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
        case 'KeyI':
          event.preventDefault()
          setShowPDFInfo(!showPDFInfo)
          break
        case 'KeyF':
          event.preventDefault()
          toggleFullscreen()
          break
        case 'KeyD':
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault()
            if (allowDownload) downloadPDF()
          }
          break
        case 'ArrowLeft':
          event.preventDefault()
          goToPreviousPage()
          break
        case 'ArrowRight':
          event.preventDefault()
          goToNextPage()
          break
        case 'Equal':
        case 'NumpadAdd':
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault()
            zoomIn()
          }
          break
        case 'Minus':
        case 'NumpadSubtract':
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault()
            zoomOut()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, showPDFInfo, allowDownload, currentPage, totalPages, zoomLevel])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
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
  const downloadPDF = useCallback(async () => {
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
    window.open(`/api/pdf/${file.id}`, '_blank')
  }, [file])

  // Share function
  const handleShare = useCallback(() => {
    if (file && onShare) {
      onShare(file)
    }
  }, [file, onShare])

  // Zoom functions
  const zoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 25, 200))
  }, [])

  const zoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 25, 50))
  }, [])

  const resetZoom = useCallback(() => {
    setZoomLevel(100)
  }, [])

  // Page navigation
  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }, [currentPage])

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }, [currentPage, totalPages])

  // Handle iframe load
  const handleIframeLoad = useCallback(() => {
    setPdfLoaded(true)
    setPdfError(false)
  }, [])

  // Handle iframe error
  const handleIframeError = useCallback(() => {
    setPdfError(true)
    setPdfLoaded(false)
  }, [])

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

  if (!isOpen || !file || file.fileType !== 'pdf') return null

  const pdfUrl = `/api/pdf/${file.id}${zoomLevel !== 100 ? `?zoom=${zoomLevel}` : ''}`

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`${styles.pdfModal} ${isFullscreen ? styles.fullscreen : ''} ${className || ''}`}
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
              <div className={styles.pdfIcon}>
                <FileText className={styles.pdfIconSvg} />
              </div>
              <div className={styles.headerContent}>
                <h3 className={styles.pdfTitle}>{file.fileName}</h3>
                <div className={styles.pdfMeta}>
                  <span className={styles.pdfSize}>
                    {formatFileSize(file.fileSize || 0)}
                  </span>
                  {totalPages > 0 && (
                    <>
                      <span className={styles.metaSeparator}>•</span>
                      <span className={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                      </span>
                    </>
                  )}
                  <span className={styles.metaSeparator}>•</span>
                  <span className={styles.zoomInfo}>{zoomLevel}%</span>
                </div>
              </div>
            </div>

            <div className={styles.headerRight}>
              {/* Navigation Controls */}
              {totalPages > 1 && (
                <div className={styles.navControls}>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={goToPreviousPage}
                    disabled={currentPage <= 1}
                    title="Previous page (←)"
                    leftIcon={<ChevronLeft />}
                  />
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={goToNextPage}
                    disabled={currentPage >= totalPages}
                    title="Next page (→)"
                    leftIcon={<ChevronRight />}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                {onShare && (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={handleShare}
                    title="Share PDF"
                    leftIcon={<Share />}
                  />
                )}

                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setShowPDFInfo(!showPDFInfo)}
                  title={showPDFInfo ? 'Hide info (I)' : 'Show info (I)'}
                  leftIcon={<Info />}
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
                    onClick={downloadPDF}
                    title="Download PDF (⌘+D)"
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
                  onClick={zoomOut}
                  disabled={zoomLevel <= 50}
                  title="Zoom out (⌘+-)"
                  leftIcon={<ZoomOut />}
                />
                <Button
                  variant="ghost"
                  size="small"
                  onClick={resetZoom}
                  disabled={zoomLevel === 100}
                  title="Reset zoom"
                >
                  {zoomLevel}%
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={zoomIn}
                  disabled={zoomLevel >= 200}
                  title="Zoom in (⌘++)"
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

        {/* PDF Container */}
        <motion.div
          className={styles.pdfContainer}
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.pdfDisplay}>
            {!pdfLoaded && !pdfError && (
              <div className={styles.pdfLoading}>
                <div className={styles.loadingSpinner} />
                <span>Loading PDF...</span>
              </div>
            )}

            {pdfError && (
              <div className={styles.pdfError}>
                <FileText className={styles.errorIcon} />
                <h3>Failed to load PDF</h3>
                <p>The PDF file could not be displayed.</p>
                <div className={styles.errorActions}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPdfError(false)
                      setPdfLoaded(false)
                    }}
                  >
                    Retry
                  </Button>
                  {allowDownload && (
                    <Button
                      variant="primary"
                      onClick={downloadPDF}
                      leftIcon={<Download />}
                    >
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={pdfUrl}
              className={styles.pdfFrame}
              title={`PDF Viewer - ${file.fileName}`}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{
                opacity: pdfLoaded ? 1 : 0,
                transform: `scale(${zoomLevel / 100})`
              }}
            />
          </div>

          {/* PDF Info Panel */}
          <AnimatePresence>
            {showPDFInfo && (
              <motion.div
                className={styles.pdfInfo}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className={styles.infoTitle}>PDF Details</h4>
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
                    <span className={styles.infoValue}>PDF Document</span>
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
                  {totalPages > 0 && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Pages:</span>
                      <span className={styles.infoValue}>{totalPages}</span>
                    </div>
                  )}
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Zoom:</span>
                    <span className={styles.infoValue}>{zoomLevel}%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PDFModal