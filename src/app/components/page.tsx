"use client"

import { useState, useEffect } from "react"
import { 
  Plus,
  Package
} from 'lucide-react'
import { ClaimItem, ClaimFile, ItemsCard, Button, ImageModal, PDFModal } from '@/components/redesigned'

// Minimal interface for basic claim info needed for API calls
interface ClaimData {
  id: string
}

export default function ComponentsPage() {
  const [claim, setClaim] = useState<ClaimData | null>(null)
  const [items, setItems] = useState<ClaimItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingImage, setViewingImage] = useState<ClaimFile | null>(null)
  const [viewingPDF, setViewingPDF] = useState<ClaimFile | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [claimId, setClaimId] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchAvailableClaim()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAvailableClaim = async () => {
    try {
      // First, try to get the first available claim from the database
      const response = await fetch('/api/claims')
      const data = await response.json()
      
      if (response.ok && data.claims && data.claims.length > 0) {
        const firstClaim = data.claims[0]
        setClaimId(firstClaim.id)
        await fetchClaimData(firstClaim.id)
      } else {
        setError('No claims found in database. Please run the seed script first.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching available claims:', error)
      setError('Failed to fetch claims from database.')
      setLoading(false)
    }
  }

  const fetchClaimData = async (id: string) => {
    try {
      // Only fetch claim basic info and items
      const [claimRes, itemsRes] = await Promise.all([
        fetch(`/api/claims/${id}`),
        fetch(`/api/claims/${id}/items`)
      ])

      const [claimData, itemsData] = await Promise.all([
        claimRes.json(),
        itemsRes.json()
      ])
      
      if (claimRes.ok) {
        setClaim({ id: claimData.id })
      } else {
        console.error("Failed to fetch claim:", claimData.error)
      }

      if (itemsRes.ok) {
        setItems(itemsData.items || [])
      } else {
        console.error("Failed to fetch items:", itemsData.error)
      }
    } catch (error) {
      console.error("Error fetching claim data:", error)
    } finally {
      setLoading(false)
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
    } catch (err) {
      console.error('Failed to delete file:', err)
      alert('Failed to delete file')
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 max-w-md mx-auto">
          <p className="text-sm text-gray-700">Loading components...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 max-w-lg mx-auto text-center">
          <div className="p-3 bg-red-50 rounded-lg w-fit mx-auto mb-4">
            <Package className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Database Setup Required</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <p className="text-xs font-medium text-gray-700 mb-2">To set up sample data, run:</p>
            <code className="text-xs bg-gray-800 text-green-400 px-2 py-1 rounded font-mono">
              npm run seed:components
            </code>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Component Showcase</h1>
            <p className="text-gray-600">Demonstrating the ItemsCard component with full database functionality</p>
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
        </div>
      </main>

      {/* Image Modal */}
      <ImageModal
        file={viewingImage}
        isOpen={!!viewingImage}
        onClose={() => setViewingImage(null)}
      />

      {/* PDF Modal */}
      <PDFModal
        file={viewingPDF}
        isOpen={!!viewingPDF}
        onClose={() => setViewingPDF(null)}
      />
    </div>
  )
}