'use client'

import { useState, useEffect, useRef } from 'react'
import { Package, FileText, Plus } from 'lucide-react'
import { 
  Library001ItemsCard, 
  Library001FilesSection,
  Library001ClaimInformation,
  Library001ClaimPageSkeleton,
  Library001EmptyItems,
  Library001SectionCard,
  Library001PageHeader,
  Library001StatusBadge,
  Library001PageAction,
  type Library001ClaimItem, 
  type Library001ClaimFile,
  type Library001ClaimData,
  type Library001ClaimFieldValues,
  type Library001ClaimFieldErrors
} from '@/components-library001'

// Using Library001ClaimData type
type ClaimData = Library001ClaimData

interface ClaimDetailsPageProps {
  params: Promise<{ id: string }>
}

export default function ClaimDetailsPage({ params }: ClaimDetailsPageProps) {
  const [claimId, setClaimId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [claim, setClaim] = useState<ClaimData | null>(null)
  const [items, setItems] = useState<Library001ClaimItem[]>([])
  const [files, setFiles] = useState<Library001ClaimFile[]>([])
  
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

  // Handle file actions from ItemsCard for state synchronization
  const handleItemFileAction = (action: string, file: Library001ClaimFile) => {
    if (action === 'untag') {
      // Update files to remove item association
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === file.id ? { ...f, item: null } : f
        )
      )
      // Update items to remove file from the item that had it
      setItems(prevItems => 
        prevItems.map(item => ({
          ...item,
          files: item.files.filter(f => f.id !== file.id)
        }))
      )
    } else if (action === 'delete') {
      // Remove file from global files list
      setFiles(prevFiles => prevFiles.filter(f => f.id !== file.id))
      // Remove file from all items
      setItems(prevItems => 
        prevItems.map(item => ({
          ...item,
          files: item.files.filter(f => f.id !== file.id)
        }))
      )
    }
  }

  const handleAddItem = () => {
    // Placeholder for adding new item functionality
    console.log('Add new item')
  }

  // Loading state with skeleton
  if (loading) {
    return <Library001ClaimPageSkeleton />
  }

  // Error state
  if (!claim) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200 max-w-md mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Claim Not Found</h2>
            <p className="text-sm text-gray-600">The claim you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Page Header */}
      <Library001PageHeader
        breadcrumbs={[
          { label: 'Claims', href: '/claims' },
          { label: claim.claimNumber }
        ]}
        title={claim.claimNumber}
        subtitle={`Created on ${new Date(claim.claimDate).toLocaleDateString()}`}
        badge={<Library001StatusBadge status={claim.status} />}
        icon={FileText}
      />

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Claim Information Section */}
          <div className="transition-all duration-300 hover:shadow-md rounded-lg">
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

          {/* Items Section */}
          <Library001SectionCard
            icon={Package}
            title="Items"
            subtitle={`${items.length} item${items.length !== 1 ? 's' : ''} documented`}
            badge={items.length}
            action={
              <Library001PageAction
                label="Add Item"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleAddItem}
                variant="secondary"
                size="sm"
              />
            }
            className="transition-all duration-300 hover:shadow-md"
          >
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="transition-all duration-300 hover:scale-[1.01]"
                  >
                    <Library001ItemsCard
                      item={item}
                      claimId={claimId}
                      onUpdate={handleItemUpdate}
                      onDelete={handleItemDelete}
                      onFileAction={handleItemFileAction}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Library001EmptyItems onAddItem={handleAddItem} />
            )}
          </Library001SectionCard>

          {/* Files Section */}
          <div className="transition-all duration-300 hover:shadow-md rounded-lg">
            <Library001FilesSection
              claimId={claimId}
              files={files}
              items={items}
              onFilesChange={setFiles}
              onItemsChange={setItems}
            />
          </div>

        </div>
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed top-20 right-10 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-20 pointer-events-none animate-pulse" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 pointer-events-none animate-pulse" />
    </div>
  )
}