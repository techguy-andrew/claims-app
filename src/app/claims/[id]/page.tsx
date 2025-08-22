"use client"

import { useState, useEffect, useRef } from "react"
import { 
  Building2, 
  User, 
  Phone, 
  Mail,
  MapPin,
  Plus,
  Package,
  Edit,
  Copy,
  Check,
  Printer
} from 'lucide-react'
import { InvisibleInput } from '@/components/shared'
import { FloatingContextMenu, type MenuAction } from '@/components/shared/floating-context-menu'
import { SaveCancelButtons } from '@/components/shared/save-cancel-buttons'
import { ClaimItem } from '@/components/claims'
import { ItemsCard } from '@/components/items'
import { ClaimFilesSection } from '@/components/claims'
import { SimpleImageModal, SimplePDFModal, type ClaimFile } from '@/components/files'
import { Button } from '@/components/ui/button'

interface ClaimData {
  id: string
  claimNumber: string
  status: 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'CLOSED'
  insuranceCompany: string
  adjustorName: string
  adjustorEmail: string
  clientName: string
  clientPhone: string
  clientAddress: string
  claimDate: string
  createdBy: {
    firstName: string | null
    lastName: string | null
    email: string
  }
  organization: {
    name: string
  }
}

// const statusGradients = {
//   OPEN: 'from-blue-400 to-blue-500',
//   IN_PROGRESS: 'from-amber-400 to-orange-500',
//   UNDER_REVIEW: 'from-purple-400 to-purple-500',
//   APPROVED: 'from-green-400 to-emerald-500',
//   DENIED: 'from-red-400 to-red-500',
//   CLOSED: 'from-gray-400 to-gray-500'
// }

const statusLabels = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN PROGRESS',
  UNDER_REVIEW: 'UNDER REVIEW',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  CLOSED: 'CLOSED'
}

export default function ClaimDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const [claim, setClaim] = useState<ClaimData | null>(null)
  const [items, setItems] = useState<ClaimItem[]>([])
  const [files, setFiles] = useState<ClaimFile[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({})
  const [showToast, setShowToast] = useState(false)
  
  // Store scroll position to prevent jumping during edit mode transitions
  const scrollPosRef = useRef(0)
  const [viewingImage, setViewingImage] = useState<ClaimFile | null>(null)
  const [viewingPDF, setViewingPDF] = useState<ClaimFile | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [claimId, setClaimId] = useState<string>('')

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

      const [claimData, itemsData, filesData] = await Promise.all([
        claimRes.json(),
        itemsRes.json(),
        filesRes.json()
      ])
      
      if (claimRes.ok) {
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
        console.error("Failed to fetch claim:", claimData.error)
      }

      if (itemsRes.ok) {
        setItems(itemsData.items || [])
      } else {
        console.error("Failed to fetch items:", itemsData.error)
      }

      if (filesRes.ok) {
        setFiles(filesData.files || [])
      } else {
        console.error("Failed to fetch files:", filesData.error)
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
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
      
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

  // Create claim menu actions
  const claimMenuActions: MenuAction[] = [
    {
      id: 'edit',
      label: 'Edit Claim Details',
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEditMode
    },
    {
      id: 'copy',
      label: 'Copy Claim Info',
      icon: <Copy className="h-4 w-4" />,
      onClick: () => {
        const claimInfo = `Claim: ${claim?.claimNumber}\nInsurance: ${claim?.insuranceCompany}\nAdjustor: ${claim?.adjustorName}\nClient: ${claim?.clientName}`
        navigator.clipboard.writeText(claimInfo)
      }
    },
    {
      id: 'print',
      label: 'Print Details',
      icon: <Printer className="h-4 w-4" />,
      onClick: () => window.print()
    }
  ]


  // Items handlers
  const handleEditItem = (item: ClaimItem) => {
    // TODO: Implement edit item functionality
    console.log('Edit item:', item)
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item? Associated files will become unassigned.')) {
      return
    }


    try {
      const response = await fetch(`/api/claims/${claim?.id}/items/${itemId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete item')
      }

      setItems(items.filter(item => item.id !== itemId))
    } catch (err) {
      console.error('Failed to delete item:', err)
      alert('Failed to delete item')
    } finally {
    }
  }

  const handleViewFile = (file: ClaimFile) => {
    if (file.fileType === 'image') {
      setViewingImage(file)
    } else if (file.fileType === 'pdf') {
      setViewingPDF(file)
    } else {
      window.open(file.fileUrl, '_blank')
    }
  }

  const handleDownloadFile = async (file: ClaimFile) => {
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
  }

  const handleUntagFile = async (fileId: string) => {
    if (!claim) return
    
    
    try {
      const response = await fetch(`/api/claims/${claim.id}/files/${fileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: null })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to untag file')
      }

      // Remove file from all items
      const updatedItems = items.map(item => ({
        ...item,
        files: item.files.filter(f => f.id !== fileId)
      }))
      setItems(updatedItems)
    } catch (err) {
      console.error('Failed to untag file:', err)
      alert('Failed to untag file')
    } finally {
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return
    }

    if (!claim) return
    

    try {
      const response = await fetch(`/api/claims/${claim.id}/files/${fileId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete file')
      }

      // Remove file from all items
      const updatedItems = items.map(item => ({
        ...item,
        files: item.files.filter(f => f.id !== fileId)
      }))
      setItems(updatedItems)
      
      // Also update files list if we're displaying it separately
      setFiles(files.filter(f => f.id !== fileId))
    } catch (err) {
      console.error('Failed to delete file:', err)
      alert('Failed to delete file')
    } finally {
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
      {/* Main content */}
      <main className="px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-lg font-semibold text-gray-900 mb-1">{claim.claimNumber}</h1>
                <p className="text-sm text-gray-600">Claim Details</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`
                  inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium
                  ${claim.status === 'OPEN' ? 'bg-blue-50 text-blue-700' :
                    claim.status === 'IN_PROGRESS' ? 'bg-yellow-50 text-yellow-700' :
                    claim.status === 'UNDER_REVIEW' ? 'bg-purple-50 text-purple-700' :
                    claim.status === 'APPROVED' ? 'bg-green-50 text-green-700' :
                    claim.status === 'DENIED' ? 'bg-red-50 text-red-700' :
                    'bg-gray-50 text-gray-700'}
                `}>
                  {statusLabels[claim.status]}
                </div>
                {!isEditing ? (
                  <FloatingContextMenu actions={claimMenuActions} />
                ) : (
                  <SaveCancelButtons
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                  />
                )}
              </div>
            </div>
          </div>

          {/* General Error Display */}
          {fieldErrors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{fieldErrors.general}</p>
            </div>
          )}

          {/* Information Sections - Flat Design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Insurance Section */}
            <div className="space-y-6">
              <h2 className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Insurance Information
              </h2>
              
              {/* Insurance Company */}
              <div className="group">
                <div className="flex items-center gap-3 p-3 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Building2 className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Company</p>
                    <InvisibleInput
                      value={fieldValues.insuranceCompany || ''}
                      onChange={(v) => setFieldValues(prev => ({ ...prev, insuranceCompany: v }))}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      isEditing={isEditing}
                      className="text-sm text-gray-900 font-medium"
                      placeholder="Insurance company"
                    />
                    {fieldErrors.insuranceCompany && (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.insuranceCompany}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Adjustor Name */}
              <div className="group">
                <div className="flex items-center gap-3 p-3 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Adjustor</p>
                    <InvisibleInput
                      value={fieldValues.adjustorName || ''}
                      onChange={(v) => setFieldValues(prev => ({ ...prev, adjustorName: v }))}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      isEditing={isEditing}
                      className="text-sm text-gray-900 font-medium"
                      placeholder="Adjustor name"
                    />
                    {fieldErrors.adjustorName && (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.adjustorName}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Adjustor Email */}
              <div className="group">
                <div className="flex items-center gap-3 p-3 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Adjustor Email</p>
                    <InvisibleInput
                      value={fieldValues.adjustorEmail || ''}
                      onChange={(v) => setFieldValues(prev => ({ ...prev, adjustorEmail: v }))}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      isEditing={isEditing}
                      className="text-sm text-gray-900 font-medium"
                      placeholder="adjustor@email.com"
                    />
                    {fieldErrors.adjustorEmail && (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.adjustorEmail}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Client Section */}
            <div className="space-y-6">
              <h2 className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Client Information
              </h2>
              
              {/* Client Name */}
              <div className="group">
                <div className="flex items-center gap-3 p-3 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Name</p>
                    <InvisibleInput
                      value={fieldValues.clientName || ''}
                      onChange={(v) => setFieldValues(prev => ({ ...prev, clientName: v }))}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      isEditing={isEditing}
                      className="text-sm text-gray-900 font-medium"
                      placeholder="Client name"
                    />
                    {fieldErrors.clientName && (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.clientName}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Client Phone */}
              <div className="group">
                <div className="flex items-center gap-3 p-3 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Phone className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Phone</p>
                    <InvisibleInput
                      value={fieldValues.clientPhone || ''}
                      onChange={(v) => setFieldValues(prev => ({ ...prev, clientPhone: v }))}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      isEditing={isEditing}
                      className="text-sm text-gray-900 font-medium"
                      placeholder="Phone number"
                    />
                    {fieldErrors.clientPhone && (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.clientPhone}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Client Address */}
              <div className="group">
                <div className="flex items-start gap-3 p-3 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Address</p>
                    <InvisibleInput
                      value={fieldValues.clientAddress || ''}
                      onChange={(v) => setFieldValues(prev => ({ ...prev, clientAddress: v }))}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      isEditing={isEditing}
                      className="text-sm text-gray-900 font-medium"
                      placeholder="Client address"
                      multiline
                    />
                    {fieldErrors.clientAddress && (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.clientAddress}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Items Section */}
            <div className="mb-8">
              <div className="space-y-6">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Package className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-gray-900">Items & Inventory</h2>
                      <p className="text-xs text-gray-600">
                        {items.length} items documented
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowAddForm(true)}
                      variant="modern"
                      size="small"
                      disabled={showAddForm}
                    >
                      <Plus className="h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </div>

                {/* Items List */}
                {items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <ItemsCard
                        key={item.id}
                        item={item}
                        claimId={claimId}
                        onUpdate={handleEditItem}
                        onDelete={handleDeleteItem}
                        onFileAction={(action, file) => {
                          switch (action) {
                            case 'view':
                              handleViewFile(file)
                              break
                            case 'download':
                              handleDownloadFile(file)
                              break
                            case 'untag':
                              handleUntagFile(file.id)
                              break
                            case 'delete':
                              handleDeleteFile(file.id)
                              break
                          }
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
                      <div className="p-3 bg-gray-50 rounded-lg w-fit mx-auto mb-4">
                        <Package className="h-6 w-6 text-gray-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">No items added yet</h3>
                      <p className="text-sm text-gray-600 mb-4">Start documenting damaged or claimed items</p>
                      <Button
                        onClick={() => setShowAddForm(true)}
                        variant="modern"
                        size="small"
                      >
                        <Plus className="h-4 w-4" />
                        Add Your First Item
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Files Section */}
            <div className="mb-8">
              <ClaimFilesSection
                claimId={claim.id}
                files={files}
                items={items}
                onFilesChange={setFiles}
                onItemsChange={setItems}
              />
            </div>
          </div>
      </main>

      {/* Image Modal */}
      <SimpleImageModal
        file={viewingImage}
        isOpen={!!viewingImage}
        onClose={() => setViewingImage(null)}
      />

      {/* PDF Modal */}
      <SimplePDFModal
        file={viewingPDF}
        isOpen={!!viewingPDF}
        onClose={() => setViewingPDF(null)}
      />

      {/* Success Toast */}
      <div
        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 z-50 ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <div className="flex items-center space-x-2">
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">Claim details updated successfully</span>
        </div>
      </div>
    </div>
  )
}