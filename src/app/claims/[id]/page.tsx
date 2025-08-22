'use client'

import { useState, useEffect, useRef } from 'react'
import { Library001ItemsCard, type Library001ClaimItem, type Library001ClaimFile } from '@/components-library001'
import { 
  Library001ClaimInformation,
  type Library001ClaimData,
  type Library001ClaimFieldValues,
  type Library001ClaimFieldErrors
} from '@/components-library001'

// Using Library001ClaimData type instead of local ClaimData
type ClaimData = Library001ClaimData

interface ClaimDetailsPageProps {
  params: Promise<{ id: string }>
}

export default function ClaimDetailsPage({ params }: ClaimDetailsPageProps) {
  const [claimId, setClaimId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [claim, setClaim] = useState<ClaimData | null>(null)
  const [items, setItems] = useState<Library001ClaimItem[]>([])
  const [, setFiles] = useState<Library001ClaimFile[]>([])
  
  // Claim information editing state
  const [isEditing, setIsEditing] = useState(false)
  const [fieldValues, setFieldValues] = useState<Library001ClaimFieldValues>({
    insuranceCompany: '',
    adjustorName: '',
    adjustorEmail: '',
    clientName: '',
    clientPhone: '',
    clientAddress: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Library001ClaimFieldErrors>({})
  
  // Store scroll position to prevent jumping during edit mode transitions
  const scrollPosRef = useRef(0)

  useEffect(() => {
    params.then(({ id }) => {
      setClaimId(id)
      fetchClaimData(id)
    })
  }, [params])

  const fetchClaimData = async (id: string) => {
    try {
      // Fetch claim, items, and files in parallel
      const [claimRes, itemsRes, filesRes] = await Promise.all([
        fetch(`/api/claims/${id}`),
        fetch(`/api/claims/${id}/items`),
        fetch(`/api/claims/${id}/files`)
      ])

      if (claimRes.ok) {
        const claimData = await claimRes.json()
        setClaim(claimData)
        // Initialize field values
        setFieldValues({
          insuranceCompany: claimData.insuranceCompany,
          adjustorName: claimData.adjustorName,
          adjustorEmail: claimData.adjustorEmail,
          clientName: claimData.clientName,
          clientPhone: claimData.clientPhone,
          clientAddress: claimData.clientAddress
        })
      } else {
        console.error("Failed to fetch claim")
      }

      if (itemsRes.ok) {
        const itemsData = await itemsRes.json()
        // Transform items to Library001 format
        const transformedItems: Library001ClaimItem[] = (itemsData.items || []).map((item: {
          id: string;
          itemName: string;
          details: string | null;
          createdAt: string;
          updatedAt: string;
          files: {
            id: string;
            fileName: string;
            fileUrl: string;
            fileType: string;
            fileSize: number | null;
            uploadedAt: string;
          }[];
        }) => ({
          id: item.id,
          itemName: item.itemName,
          details: item.details,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          files: item.files.map((file) => ({
            id: file.id,
            fileName: file.fileName,
            fileUrl: file.fileUrl,
            fileType: file.fileType,
            fileSize: file.fileSize,
            uploadedAt: file.uploadedAt,
            item: {
              id: item.id,
              itemName: item.itemName
            }
          }))
        }))
        setItems(transformedItems)
      } else {
        console.error("Failed to fetch items")
      }

      if (filesRes.ok) {
        const filesData = await filesRes.json()
        // Transform files to Library001 format
        const transformedFiles: Library001ClaimFile[] = (filesData.files || []).map((file: {
          id: string;
          fileName: string;
          fileUrl: string;
          fileType: string;
          fileSize: number | null;
          uploadedAt: string;
          item?: {
            id: string;
            itemName: string;
          } | null;
        }) => ({
          id: file.id,
          fileName: file.fileName,
          fileUrl: file.fileUrl,
          fileType: file.fileType,
          fileSize: file.fileSize,
          uploadedAt: file.uploadedAt,
          item: file.item ? {
            id: file.item.id,
            itemName: file.item.itemName
          } : null
        }))
        setFiles(transformedFiles)
      } else {
        console.error("Failed to fetch files")
      }
    } catch (error) {
      console.error("Error fetching claim data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditMode = () => {
    // Store scroll position before any state changes to prevent screen jumping
    scrollPosRef.current = window.scrollY
    setIsEditing(true)
    setFieldErrors({})
  }

  const handleCancel = () => {
    if (!claim) return
    setIsEditing(false)
    // Reset all field values to original claim data
    setFieldValues({
      insuranceCompany: claim.insuranceCompany,
      adjustorName: claim.adjustorName,
      adjustorEmail: claim.adjustorEmail,
      clientName: claim.clientName,
      clientPhone: claim.clientPhone,
      clientAddress: claim.clientAddress
    })
    setFieldErrors({})
    
    // Restore scroll position to prevent screen jumping
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosRef.current)
    })
  }

  const handleSave = async () => {
    if (!claim) return
    
    // Validate required fields
    const errors: Record<string, string> = {}
    if (!fieldValues.insuranceCompany?.trim()) errors.insuranceCompany = 'Insurance company is required'
    if (!fieldValues.adjustorName?.trim()) errors.adjustorName = 'Adjustor name is required'
    if (!fieldValues.clientName?.trim()) errors.clientName = 'Client name is required'
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    
    setIsSaving(true)
    setFieldErrors({})
    
    try {
      const response = await fetch(`/api/claims/${claim.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insuranceCompany: fieldValues.insuranceCompany.trim(),
          adjustorName: fieldValues.adjustorName.trim(),
          adjustorEmail: fieldValues.adjustorEmail.trim(),
          clientName: fieldValues.clientName.trim(),
          clientPhone: fieldValues.clientPhone.trim(),
          clientAddress: fieldValues.clientAddress.trim()
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update claim')
      }
      
      const updatedClaim = await response.json()
      setClaim(updatedClaim)
      setIsEditing(false)
      
      // Restore scroll position after successful save
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosRef.current)
      })
    } catch (err) {
      console.error('Save failed:', err)
      setFieldErrors({ 
        general: err instanceof Error ? err.message : 'Failed to update claim'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setFieldValues((prev: Library001ClaimFieldValues) => ({ ...prev, [field]: value }))
  }

  const handleItemUpdate = (updatedItem: Library001ClaimItem) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    )
  }

  const handleItemDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item? Associated files will become unassigned.')) {
      return
    }

    try {
      const response = await fetch(`/api/claims/${claimId}/items/${itemId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete item')
      }

      setItems(prevItems => prevItems.filter(item => item.id !== itemId))
    } catch (err) {
      console.error('Failed to delete item:', err)
      alert('Failed to delete item')
    }
  }

  const handleFileAction = async (action: string, file: Library001ClaimFile) => {
    switch (action) {
      case 'view':
        if (file.fileType === 'image') {
          // Could implement image modal here or handle differently
          window.open(file.fileUrl, '_blank')
        } else if (file.fileType === 'pdf') {
          // Could implement PDF modal here or handle differently
          window.open(file.fileUrl, '_blank')
        } else {
          window.open(file.fileUrl, '_blank')
        }
        break
      case 'download':
        try {
          const link = document.createElement('a')
          link.href = `/api/download/${file.id}`
          link.download = file.fileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } catch (error) {
          console.error('Download failed:', error)
          alert('Failed to download file')
        }
        break
      case 'untag':
        try {
          const response = await fetch(`/api/claims/${claimId}/files/${file.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId: null })
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to untag file')
          }

          // Remove file from items
          setItems(prevItems => 
            prevItems.map(item => ({
              ...item,
              files: item.files.filter(f => f.id !== file.id)
            }))
          )
        } catch (err) {
          console.error('Failed to untag file:', err)
          alert('Failed to untag file')
        }
        break
      case 'delete':
        if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
          return
        }

        try {
          const response = await fetch(`/api/claims/${claimId}/files/${file.id}`, {
            method: 'DELETE'
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to delete file')
          }

          // Remove file from items
          setItems(prevItems => 
            prevItems.map(item => ({
              ...item,
              files: item.files.filter(f => f.id !== file.id)
            }))
          )
        } catch (err) {
          console.error('Failed to delete file:', err)
          alert('Failed to delete file')
        }
        break
    }
  }

  if (loading || !claim) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 max-w-md mx-auto">
          <p className="text-sm text-gray-700">{loading ? "Loading claim details..." : "Claim not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Claim Information using Library001 Component */}
          <div className="mb-8">
            <Library001ClaimInformation
              claim={claim}
              isEditing={isEditing}
              fieldValues={fieldValues}
              fieldErrors={fieldErrors}
              isSaving={isSaving}
              onEditMode={handleEditMode}
              onSave={handleSave}
              onCancel={handleCancel}
              onFieldChange={handleFieldChange}
            />
          </div>

          {/* Items Section using Library001 Components */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Items</h2>
                <p className="text-sm text-gray-600">
                  {items.length} item{items.length !== 1 ? 's' : ''} documented
                </p>
              </div>
            </div>

            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <Library001ItemsCard
                    key={item.id}
                    item={item}
                    claimId={claimId}
                    onUpdate={handleItemUpdate}
                    onDelete={handleItemDelete}
                    onFileAction={handleFileAction}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">No items added yet</h3>
                  <p className="text-sm text-gray-600 mb-4">Start documenting damaged or claimed items</p>
                </div>
              </div>
            )}

            {/* Component Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                📚 Library001 Component Features
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Seamless inline editing with database integration</li>
                <li>• Floating context menus with intelligent positioning</li>
                <li>• File thumbnails and management</li>
                <li>• Expandable/collapsible interface</li>
                <li>• Toast notifications for user feedback</li>
                <li>• Professional naming convention for reusability</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}