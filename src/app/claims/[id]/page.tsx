"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

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

const statusColors = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800", 
  UNDER_REVIEW: "bg-purple-100 text-purple-800",
  APPROVED: "bg-green-100 text-green-800",
  DENIED: "bg-red-100 text-red-800",
  CLOSED: "bg-gray-100 text-gray-800"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadge = (status: string) => {
    const colorClass = statusColors[status as keyof typeof statusColors] || statusColors.OPEN
    return (
      <Badge className={colorClass}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Loading...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (!claim) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Claim Not Found</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Claim #{claim.sequentialNumber}</h1>
            <p className="text-muted-foreground mt-2">
              Created on {formatDate(claim.claimDate)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusBadge(claim.status)}
          {editing ? (
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Client Information */}
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
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                />
              ) : (
                <div className="font-medium">{claim.clientName}</div>
              )}
            </div>
            
            <div>
              <Label>Email</Label>
              {editing ? (
                <Input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                />
              ) : (
                <div className="font-medium">{claim.clientEmail || "Not provided"}</div>
              )}
            </div>
            
            <div>
              <Label>Phone</Label>
              {editing ? (
                <Input
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                />
              ) : (
                <div className="font-medium">{claim.clientPhone || "Not provided"}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Claim Details */}
        <Card>
          <CardHeader>
            <CardTitle>Claim Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Claim Number</Label>
              {editing ? (
                <Input
                  type="number"
                  min="1"
                  value={formData.sequentialNumber}
                  onChange={(e) => handleInputChange("sequentialNumber", e.target.value)}
                />
              ) : (
                <div className="font-medium">#{claim.sequentialNumber}</div>
              )}
            </div>

            <div>
              <Label>Status</Label>
              {editing ? (
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="DENIED">Denied</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div>{getStatusBadge(claim.status)}</div>
              )}
            </div>

            <div>
              <Label>Incident Date</Label>
              {editing ? (
                <Input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => handleInputChange("incidentDate", e.target.value)}
                />
              ) : (
                <div className="font-medium">
                  {claim.incidentDate ? formatDate(claim.incidentDate) : "Not specified"}
                </div>
              )}
            </div>

            <div>
              <Label>Item Description</Label>
              {editing ? (
                <Input
                  value={formData.itemDescription}
                  onChange={(e) => handleInputChange("itemDescription", e.target.value)}
                />
              ) : (
                <div className="font-medium">{claim.itemDescription}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Damage Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Damage Details</CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <Textarea
                value={formData.damageDetails}
                onChange={(e) => handleInputChange("damageDetails", e.target.value)}
                rows={4}
              />
            ) : (
              <div className="whitespace-pre-wrap">{claim.damageDetails}</div>
            )}
          </CardContent>
        </Card>

        {/* Inspections */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Inspections</CardTitle>
            <CardDescription>
              {claim.inspections.length} inspection{claim.inspections.length !== 1 ? 's' : ''} recorded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {claim.inspections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No inspections yet. Create an inspection to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {claim.inspections.map((inspection) => (
                  <div key={inspection.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        Inspection on {formatDate(inspection.inspectionDate)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Inspector: {inspection.inspector.firstName} {inspection.inspector.lastName}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}