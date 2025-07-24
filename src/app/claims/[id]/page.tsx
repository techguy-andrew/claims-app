"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Button, 
  Input, 
  Label, 
  Textarea, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Select,
  Badge 
} from "@/components/ui"

interface ClaimData {
  id: string
  claimNumber: string
  sequentialNumber: number
  clientName: string
  clientEmail: string | null
  clientPhone: string | null
  itemDescription: string
  damageDetails: string
  status: string
  incidentDate: string | null
  claimDate: string
  createdBy: {
    firstName: string | null
    lastName: string | null
    email: string
  }
  inspections: Array<{
    id: string
    inspectionDate: string
    inspector: {
      firstName: string | null
      lastName: string | null
    }
  }>
}

export default function ClaimDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [claimId, setClaimId] = useState<string>("")
  const [claim, setClaim] = useState<ClaimData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    itemDescription: "",
    damageDetails: "",
    status: "",
    incidentDate: "",
    sequentialNumber: ""
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
          status: data.status,
          incidentDate: data.incidentDate ? data.incidentDate.split('T')[0] : "",
          sequentialNumber: data.sequentialNumber.toString()
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

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...formData,
        sequentialNumber: formData.sequentialNumber ? parseInt(formData.sequentialNumber) : undefined
      }
      
      const response = await fetch(`/api/claims/${claimId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const updatedClaim = await response.json()
        setClaim(updatedClaim)
        setEditing(false)
      } else {
        const error = await response.json()
        console.error("Failed to update claim:", error)
      }
    } catch (error) {
      console.error("Error updating claim:", error)
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
        status: claim.status,
        incidentDate: claim.incidentDate ? claim.incidentDate.split('T')[0] : "",
        sequentialNumber: claim.sequentialNumber.toString()
      })
    }
    setEditing(false)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      OPEN: { variant: 'primary' as const, text: 'Open' },
      IN_PROGRESS: { variant: 'warning' as const, text: 'In Progress' },
      UNDER_REVIEW: { variant: 'secondary' as const, text: 'Under Review' },
      APPROVED: { variant: 'success' as const, text: 'Approved' },
      DENIED: { variant: 'error' as const, text: 'Denied' },
      CLOSED: { variant: 'default' as const, text: 'Closed' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.CLOSED
    
    return (
      <Badge variant={config.variant}>
        {config.text}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent>
            <div className="text-center py-8">Loading claim details...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!claim) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent>
            <div className="text-center py-8 text-red-600">
              Claim not found or failed to load.
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="secondary" 
            onClick={() => router.push('/claims')}
          >
            ← Back to Claims
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Claim #{claim.sequentialNumber}</h1>
            <p className="text-gray-600 mt-1">
              Created on {formatDate(claim.claimDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(claim.status)}
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
      </div>

      {/* Claim Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Client Name</Label>
              {editing ? (
                <Input
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                />
              ) : (
                <p className="text-gray-900 font-medium">{claim.clientName}</p>
              )}
            </div>
            
            <div>
              <Label>Email</Label>
              {editing ? (
                <Input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                />
              ) : (
                <p className="text-gray-600">{claim.clientEmail || 'Not provided'}</p>
              )}
            </div>
            
            <div>
              <Label>Phone</Label>
              {editing ? (
                <Input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                />
              ) : (
                <p className="text-gray-600">{claim.clientPhone || 'Not provided'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Claim Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Status</Label>
              {editing ? (
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  options={[
                    { value: 'OPEN', label: 'Open' },
                    { value: 'IN_PROGRESS', label: 'In Progress' },
                    { value: 'UNDER_REVIEW', label: 'Under Review' },
                    { value: 'APPROVED', label: 'Approved' },
                    { value: 'DENIED', label: 'Denied' },
                    { value: 'CLOSED', label: 'Closed' }
                  ]}
                />
              ) : (
                getStatusBadge(claim.status)
              )}
            </div>
            
            <div>
              <Label>Incident Date</Label>
              {editing ? (
                <Input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                />
              ) : (
                <p className="text-gray-600">
                  {claim.incidentDate ? formatDate(claim.incidentDate) : 'Not specified'}
                </p>
              )}
            </div>
            
            <div>
              <Label>Created By</Label>
              <p className="text-gray-600">
                {claim.createdBy.firstName} {claim.createdBy.lastName} ({claim.createdBy.email})
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Item and Damage Details */}
      <Card>
        <CardHeader>
          <CardTitle>Item & Damage Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Item Description</Label>
            {editing ? (
              <Textarea
                value={formData.itemDescription}
                onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                rows={3}
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 p-3 rounded border">
                {claim.itemDescription}
              </p>
            )}
          </div>
          
          <div>
            <Label>Damage Details</Label>
            {editing ? (
              <Textarea
                value={formData.damageDetails}
                onChange={(e) => handleInputChange('damageDetails', e.target.value)}
                rows={4}
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 p-3 rounded border">
                {claim.damageDetails}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inspections */}
      <Card>
        <CardHeader>
          <CardTitle>Inspections</CardTitle>
          <CardDescription>
            {claim.inspections.length} inspection{claim.inspections.length !== 1 ? 's' : ''} scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {claim.inspections.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No inspections scheduled yet.
            </div>
          ) : (
            <div className="space-y-3">
              {claim.inspections.map((inspection) => (
                <div key={inspection.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">
                      Inspector: {inspection.inspector.firstName} {inspection.inspector.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {formatDate(inspection.inspectionDate)}
                    </p>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={() => router.push(`/inspections/${inspection.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}