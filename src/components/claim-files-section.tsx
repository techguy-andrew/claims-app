'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Upload, File, AlertCircle, CheckCircle, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClaimItem, ClaimFile } from './claim-items-section'
import { SimplePDFModal } from './simple-pdf-modal'
import { SimpleImageModal } from './simple-image-modal'
import { ItemTagModal } from './item-tag-modal'
import { FilesList } from './files-list'

// Re-export for external usage
export type { ClaimFile }

interface ClaimFilesSectionProps {
  claimId: string
  files: ClaimFile[]
  items: ClaimItem[]
  onFilesChange: (files: ClaimFile[]) => void
  onItemsChange: (items: ClaimItem[]) => void
}

interface UploadProgress {
  [key: string]: number
}

export function ClaimFilesSection({ claimId, files, items, onFilesChange, onItemsChange }: ClaimFilesSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({})
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [viewingPDF, setViewingPDF] = useState<ClaimFile | null>(null)
  const [viewingImage, setViewingImage] = useState<ClaimFile | null>(null)
  const [tagModalFile, setTagModalFile] = useState<ClaimFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Clear messages after timeout
  const clearMessages = useCallback(() => {
    setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 3000)
  }, [])

  // Handle PDF viewing
  const handleViewPDF = useCallback((file: ClaimFile) => {
    setViewingPDF(file)
  }, [])

  const handleClosePDFViewer = useCallback(() => {
    setViewingPDF(null)
  }, [])

  // Handle image viewing
  const handleViewImage = useCallback((file: ClaimFile) => {
    setViewingImage(file)
  }, [])

  const handleCloseImageViewer = useCallback(() => {
    setViewingImage(null)
  }, [])

  // Handle file download
  const handleDownloadFile = useCallback(async (file: ClaimFile) => {
    try {
      const link = document.createElement('a')
      link.href = `/api/download/${file.id}`
      link.download = file.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
      setError('Failed to download file')
      clearMessages()
    }
  }, [clearMessages])

  // Validate file before upload
  const validateFile = useCallback((file: File): string | null => {
    // Different size limits for different file types
    const isPDF = file.type === 'application/pdf' || 
                  file.type === 'application/x-pdf' || 
                  file.name.toLowerCase().endsWith('.pdf')
    
    const maxSize = isPDF ? 10 * 1024 * 1024 : 50 * 1024 * 1024 // 10MB for PDFs, 50MB for others
    
    if (file.size > maxSize) {
      const sizeLimit = isPDF ? '10MB' : '50MB'
      return `File "${file.name}" is too large. Maximum size for ${isPDF ? 'PDFs' : 'this file type'} is ${sizeLimit}.`
    }
    
    // Type validation with expanded PDF support
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // PDFs - multiple MIME types
      'application/pdf', 'application/x-pdf',
      // Documents
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    // Also check file extension for PDFs
    const isPDFByExtension = file.name.toLowerCase().endsWith('.pdf')
    const isValidType = allowedTypes.includes(file.type) || isPDFByExtension
    
    if (!isValidType) {
      return `File "${file.name}" has unsupported format. Allowed: images, PDF, Word documents, and text files.`
    }
    
    return null
  }, [])

  // Handle file upload
  const handleFileUpload = useCallback(async (selectedFiles: FileList) => {
    // Validate all files first
    const validationErrors = Array.from(selectedFiles)
      .map(validateFile)
      .filter(error => error !== null)
    
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'))
      clearMessages()
      return
    }

    const uploadPromises = Array.from(selectedFiles).map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('claimId', claimId)

      const uploadId = Math.random().toString()
      setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }))

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        setUploadProgress(prev => ({ ...prev, [uploadId]: 100 }))

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to upload file')
        }

        const result = await response.json()
        return result.fileRecord

      } catch (error) {
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[uploadId]
          return newProgress
        })
        console.error('Upload error for file:', file.name, error)
        throw error
      } finally {
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[uploadId]
            return newProgress
          })
        }, 1000)
      }
    })

    try {
      setError(null)
      const uploadedFiles = await Promise.all(uploadPromises)
      onFilesChange([...files, ...uploadedFiles])
      setSuccess(`Successfully uploaded ${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''}`)
      clearMessages()
    } catch (err) {
      console.error('Upload batch error:', err)
      let errorMessage = 'Failed to upload files'
      
      if (err instanceof Error) {
        errorMessage = err.message
      }
      
      // If it's a detailed error from the API, try to parse it
      if (typeof err === 'object' && err !== null && 'error' in err) {
        const errorObj = err as Record<string, unknown>
        errorMessage = String(errorObj.error)
        if (errorObj.details) {
          console.error('Detailed error:', errorObj.details)
        }
        
        // Check if this was a PDF-related error
        if (errorObj.cloudinaryConfig) {
          console.error('Cloudinary config:', errorObj.cloudinaryConfig)
        }
      }
      
      // Add helpful context for common PDF issues
      if (errorMessage.includes('PDF') || errorMessage.includes('pdf')) {
        errorMessage += '\n\nTip: PDFs have a 10MB limit and require different processing than images.'
      }
      
      setError(errorMessage)
      clearMessages()
    }
  }, [claimId, files, onFilesChange, clearMessages, validateFile])

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles)
    }
  }, [handleFileUpload])

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files)
      e.target.value = '' // Reset input
    }
  }, [handleFileUpload])


  // Delete file
  const handleDeleteFile = useCallback(async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return
    }

    setLoading(fileId)
    setError(null)

    try {
      const response = await fetch(`/api/claims/${claimId}/files/${fileId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete file')
      }

      // Update files list
      onFilesChange(files.filter(file => file.id !== fileId))
      
      // Update items list to remove the file
      const updatedItems = items.map(item => ({
        ...item,
        files: item.files.filter(file => file.id !== fileId)
      }))
      onItemsChange(updatedItems)

      setSuccess('File deleted successfully')
      clearMessages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file')
      clearMessages()
    } finally {
      setLoading(null)
    }
  }, [claimId, files, items, onFilesChange, onItemsChange, clearMessages])

  // Handle tagging file to item
  const handleTagFile = useCallback(async (fileId: string, itemId: string | null) => {
    setLoading(fileId)
    setError(null)
    
    try {
      const response = await fetch(`/api/claims/${claimId}/files/${fileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to tag file')
      }

      const updatedFile = await response.json()
      
      // Update files list
      onFilesChange(files.map(file => file.id === fileId ? updatedFile : file))
      
      // Update items list to reflect new file assignments
      const updatedItems = items.map(item => {
        // Remove file from its current item
        const filesWithoutThis = item.files.filter(f => f.id !== fileId)
        
        if (itemId && item.id === itemId) {
          // Add file to the target item
          return { ...item, files: [...filesWithoutThis, updatedFile] }
        } else {
          // Just remove the file if it was previously assigned to this item
          return { ...item, files: filesWithoutThis }
        }
      })
      onItemsChange(updatedItems)

      setSuccess(itemId ? 'File tagged successfully' : 'File tag removed successfully')
      clearMessages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to tag file')
      clearMessages()
    } finally {
      setLoading(null)
    }
  }, [claimId, files, items, onFilesChange, onItemsChange, clearMessages])

  // Handle creating new item
  const handleCreateItem = useCallback(async (itemName: string, details?: string): Promise<ClaimItem> => {
    const response = await fetch(`/api/claims/${claimId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemName: itemName.trim(),
        details: details?.trim() || null
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create item')
    }

    const newItem = await response.json()
    onItemsChange([...items, newItem])
    return newItem
  }, [claimId, items, onItemsChange])


  // Handle action menu actions
  const handleActionMenuAction = useCallback((action: string, file: ClaimFile) => {
    switch (action) {
      case 'view':
        if (file.fileType === 'image') {
          handleViewImage(file)
        } else if (file.fileType === 'pdf') {
          handleViewPDF(file)
        } else {
          window.open(file.fileUrl, '_blank')
        }
        break
      case 'tag':
        setTagModalFile(file)
        break
      case 'download':
        handleDownloadFile(file)
        break
      case 'delete':
        handleDeleteFile(file.id)
        break
    }
  }, [handleViewImage, handleViewPDF, handleDownloadFile, handleDeleteFile])


  // Sort files by most recent first
  const sortedFiles = [...files].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <File className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-900">Files & Documents</h2>
            <p className="text-xs text-gray-600">
              {files.length} files uploaded
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="modern"
            size="small"
            disabled={Object.keys(uploadProgress).length > 0}
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-green-800">Success</h3>
            <p className="text-sm text-green-700 mt-1">{success}</p>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Uploading files...</h3>
          <div className="space-y-2">
            {Object.entries(uploadProgress).map(([id, progress]) => (
              <div key={id} className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <Upload className={`h-6 w-6 ${isDragOver ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Or click &quot;Upload Files&quot; to browse • Supports images (50MB), PDFs (10MB), and documents
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-blue-600 bg-blue-50/50 rounded-lg px-3 py-2 mt-2">
              <Tag className="h-3 w-3" />
              <span>Tip: Add <code className="bg-blue-100 px-1 rounded">#ItemName</code> to filename for auto-tagging (e.g., <code className="bg-blue-100 px-1 rounded">kitchen_damage_#DiningTable.jpg</code>)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Files List */}
      {sortedFiles.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Files</h3>
            <p className="text-sm text-gray-600">
              {files.length} files • {files.filter(f => f.item).length} tagged
            </p>
          </div>
          
          <FilesList
            files={sortedFiles}
            onFileAction={handleActionMenuAction}
            loading={loading}
            showThumbnails={true}
          />
        </div>
      ) : Object.keys(uploadProgress).length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg">
            <div className="p-3 bg-gray-50 rounded-lg w-fit mx-auto mb-4">
              <File className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">No files uploaded yet</h3>
            <p className="text-sm text-gray-600 mb-4">Upload images, PDFs, and documents to get started</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="modern"
              size="small"
            >
              <Upload className="h-4 w-4" />
              Upload Your First File
            </Button>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      <SimplePDFModal
        file={viewingPDF}
        isOpen={!!viewingPDF}
        onClose={handleClosePDFViewer}
      />

      {/* Image Modal */}
      <SimpleImageModal
        file={viewingImage}
        isOpen={!!viewingImage}
        onClose={handleCloseImageViewer}
      />

      {/* Item Tag Modal */}
      <ItemTagModal
        isOpen={!!tagModalFile}
        onClose={() => setTagModalFile(null)}
        file={tagModalFile}
        items={items}
        onTagFile={handleTagFile}
        onCreateItem={handleCreateItem}
      />
      
    </div>
  )
}