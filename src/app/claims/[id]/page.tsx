"use client"

import { useState, useEffect } from "react"
import { 
  Building2, 
  User, 
  Phone, 
  Mail,
  MapPin,
  Edit,
  CheckCircle,
  AlertCircle,
  Plus,
  Package
} from 'lucide-react'
import { InfoCard } from '@/components/info-card'
import { ClaimForm } from '@/components/claim-form'
import { ClaimFormData } from '@/lib/form-validation'
import { ClaimItem } from '@/components/claim-items-section'
import { ItemsCard } from '@/components/items-card'
import { ClaimFilesSection, ClaimFile } from '@/components/claim-files-section'
import { SimpleImageModal } from '@/components/simple-image-modal'
import { SimplePDFModal } from '@/components/simple-pdf-modal'
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
  const [editing, setEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [viewingImage, setViewingImage] = useState<ClaimFile | null>(null)
  const [viewingPDF, setViewingPDF] = useState<ClaimFile | null>(null)
  const [itemsLoading, setItemsLoading] = useState<string | null>(null)
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


  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value)
  }

  const handleEdit = () => {
    setEditing(true)
    setUpdateError(null)
    setUpdateSuccess(false)
  }

  const handleCancelEdit = () => {
    setEditing(false)
    setUpdateError(null)
    setUpdateSuccess(false)
  }

  const handleUpdateSubmit = async (data: ClaimFormData & { organizationId: string; createdById: string }) => {
    if (!claim) return

    setUpdating(true)
    setUpdateError(null)

    try {
      const response = await fetch(`/api/claims/${claim.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update claim')
      }

      const updatedClaim = await response.json()
      setClaim(updatedClaim)
      setEditing(false)
      setUpdateSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Error updating claim:', err)
      setUpdateError(err instanceof Error ? err.message : 'Failed to update claim')
    } finally {
      setUpdating(false)
    }
  }

  // Items handlers
  const handleEditItem = (item: ClaimItem) => {
    // TODO: Implement edit item functionality
    console.log('Edit item:', item)
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item? Associated files will become unassigned.')) {
      return
    }

    setItemsLoading(itemId)

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
      setItemsLoading(null)
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
    
    setItemsLoading(fileId)
    
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
      setItemsLoading(null)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return
    }

    if (!claim) return
    
    setItemsLoading(fileId)

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
      setItemsLoading(null)
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
        {editing ? (
          // Edit Mode
          <div>
            {/* Edit Header */}
            <div className="max-w-2xl mx-auto mb-6">
              <h1 className="text-lg font-semibold text-gray-900 mb-1">Edit Claim</h1>
              <p className="text-sm text-gray-600">{claim.claimNumber}</p>
            </div>

            {/* Update Error Message */}
            {updateError && (
              <div className="max-w-2xl mx-auto mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error Updating Claim</h3>
                    <p className="text-sm text-red-700 mt-1">{updateError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Form */}
            <div className="max-w-2xl mx-auto">
              <ClaimForm
                initialData={claim}
                isEditing={true}
                onSubmit={handleUpdateSubmit}
                onCancel={handleCancelEdit}
                loading={updating}
                submitText="Save Changes"
                cancelText="Cancel"
              />
            </div>
          </div>
        ) : (
          // View Mode
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
                <div className="flex items-center justify-between">
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
                    <Button 
                      onClick={handleEdit}
                      variant="modern"
                      size="small"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Claim
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {updateSuccess && (
              <div className="mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Claim Updated Successfully</h3>
                    <p className="text-sm text-green-700 mt-1">Your changes have been saved.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Information Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Insurance Section */}
              <div>
                <h2 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-4">
                  Insurance Information
                </h2>
                <div className="space-y-4">
                  <InfoCard 
                    icon={Building2}
                    label="Company" 
                    value={claim.insuranceCompany}
                    onCopy={handleCopy}
                  />
                  <InfoCard 
                    icon={User}
                    label="Adjustor" 
                    value={claim.adjustorName}
                    onCopy={handleCopy}
                  />
                  <InfoCard 
                    icon={Mail}
                    label="Adjustor Email" 
                    value={claim.adjustorEmail}
                    onCopy={handleCopy}
                  />
                </div>
              </div>

              {/* Client Section */}
              <div>
                <h2 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-4">
                  Client Information
                </h2>
                <div className="space-y-4">
                  <InfoCard 
                    icon={User}
                    label="Name" 
                    value={claim.clientName}
                    onCopy={handleCopy}
                  />
                  <InfoCard 
                    icon={Phone}
                    label="Phone" 
                    value={claim.clientPhone}
                    onCopy={handleCopy}
                  />
                  <InfoCard 
                    icon={MapPin}
                    label="Address" 
                    value={claim.clientAddress}
                    onCopy={handleCopy}
                  />
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
                        isExpanded={expandedItem === item.id}
                        onToggleExpanded={(itemId) => {
                          setExpandedItem(expandedItem === itemId ? null : itemId)
                        }}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                        onViewFile={handleViewFile}
                        onDownloadFile={handleDownloadFile}
                        onUntagFile={handleUntagFile}
                        onDeleteFile={handleDeleteFile}
                        loading={itemsLoading === item.id}
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
        )}
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
    </div>
  )
}