"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Button, 
  Input, 
  Label,
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle
} from "@/components/ui"
import { PhotoUpload } from '@/components/photo-upload'
import { PhotoViewer } from '@/components/photo-viewer'
import { TopBar } from '@/components/navigation/topbar'
import { useSidebar } from '@/components/navigation'

interface ClaimData {
  id: string
  claimNumber: string
  clientName: string
  clientEmail: string | null
  clientPhone: string | null
  itemDescription: string
  damageDetails: string
  photos: string[]
  status: string
  incidentDate: string | null
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

export default function ClaimDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { toggle } = useSidebar()
  const [claimId, setClaimId] = useState<string>("")
  const [claim, setClaim] = useState<ClaimData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    itemDescription: "",
    damageDetails: "",
    photos: [] as string[]
  })

  useEffect(() => {
    params.then(({ id }) => {
      setClaimId(id)
      fetchClaim(id)
    })
  }, [params])

  const fetchClaim = async (id: string) => {
    try {
      const response = await fetch(`/api/claims/${id}`)
      const data = await response.json()
      
      if (response.ok) {
        setClaim(data)
        setFormData({
          clientName: data.clientName,
          clientEmail: data.clientEmail || "",
          clientPhone: data.clientPhone || "",
          itemDescription: data.itemDescription,
          damageDetails: data.damageDetails,
          photos: data.photos || []
        })
      } else {
        console.error("Failed to fetch claim:", data.error)
      }
    } catch (error) {
      console.error("Error fetching claim:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePhotosChange = (photos: string[]) => {
    setFormData(prev => ({
      ...prev,
      photos
    }))
  }

  const openPhotoViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/claims/${claimId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedClaim = await response.json()
        setClaim(updatedClaim)
        setEditing(false)
      } else {
        const error = await response.json()
        console.error("Failed to update claim:", error)
        alert("Failed to save changes. Please try again.")
      }
    } catch (error) {
      console.error("Error updating claim:", error)
      alert("Failed to save changes. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (claim) {
      setFormData({
        clientName: claim.clientName,
        clientEmail: claim.clientEmail || "",
        clientPhone: claim.clientPhone || "",
        itemDescription: claim.itemDescription,
        damageDetails: claim.damageDetails,
        photos: claim.photos || []
      })
    }
    setEditing(false)
  }

  if (loading) {
    return (
      <>
        <TopBar
          title="Claim Details"
          subtitle="View and edit claim information"
          showMenuButton={true}
          onMenuToggle={toggle}
        />
        <div className="p-6">
          <Card>
            <CardContent>
              <div className="text-center py-8">Loading claim details...</div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  if (!claim) {
    return (
      <>
        <TopBar
          title="Claim Details"
          subtitle="View and edit claim information"
          showMenuButton={true}
          onMenuToggle={toggle}
        />
        <div className="p-6">
          <Card>
            <CardContent>
              <div className="text-center py-8 text-red-600">
                Claim not found or failed to load.
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar
        title={`Claim ${claim.claimNumber}`}
        subtitle="View and edit claim information"
        showMenuButton={true}
        onMenuToggle={toggle}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/claims">
              <Button variant="secondary">
                ← Back to Claims
              </Button>
            </Link>
            {!editing ? (
              <Button onClick={() => setEditing(true)}>
                ✏️ Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} loading={saving}>
                  💾 Save
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  ✕ Cancel
                </Button>
              </div>
            )}
          </div>
        }
      />
      <div className="p-6 space-y-6">

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>
            Client contact details for this claim
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            {editing ? (
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="Enter client name"
              />
            ) : (
              <p className="text-gray-900 font-medium mt-2">{claim.clientName}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientEmail">Client Email</Label>
              {editing ? (
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  placeholder="client@example.com"
                />
              ) : (
                <p className="text-gray-900 font-medium mt-2">{claim.clientEmail || 'Not provided'}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="clientPhone">Client Phone</Label>
              {editing ? (
                <Input
                  id="clientPhone"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              ) : (
                <p className="text-gray-900 font-medium mt-2">{claim.clientPhone || 'Not provided'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claim Details */}
      <Card>
        <CardHeader>
          <CardTitle>Claim Details</CardTitle>
          <CardDescription>
            Item and damage information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="itemDescription">Item Description</Label>
            {editing ? (
              <Input
                id="itemDescription"
                value={formData.itemDescription}
                onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                placeholder="Describe the item"
              />
            ) : (
              <p className="text-gray-900 font-medium mt-2">{claim.itemDescription}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="damageDetails">Damage Details</Label>
            {editing ? (
              <Input
                id="damageDetails"
                value={formData.damageDetails}
                onChange={(e) => handleInputChange('damageDetails', e.target.value)}
                placeholder="Describe the damage"
              />
            ) : (
              <p className="text-gray-900 font-medium mt-2">{claim.damageDetails}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Photos Display */}
      {(claim?.photos && claim.photos.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <CardDescription>
              {claim.photos.length} photo{claim.photos.length !== 1 ? 's' : ''} attached to this claim
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {claim.photos.map((photo, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <Image
                    src={photo}
                    alt={`Claim photo ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-24 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                    onClick={() => openPhotoViewer(index)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Upload (Edit Mode Only) */}
      {editing && (
        <PhotoUpload 
          onPhotosChange={handlePhotosChange}
          existingPhotos={formData.photos}
          maxPhotos={10}
        />
      )}

      <PhotoViewer
        photos={claim?.photos || []}
        initialIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
      </div>
    </>
  )
}