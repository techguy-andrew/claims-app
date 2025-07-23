"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CldImage } from "next-cloudinary"
import { ArrowLeft, Edit, Save, X, Camera, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface InspectionData {
  id: string
  inspectionDate: string
  inspectorNotes: string | null
  damageAssessment: string | null
  photos: string[]
  inspector: {
    firstName: string | null
    lastName: string | null
    email: string
  }
  claim: {
    id: string
    claimNumber: string
    clientName: string
    itemDescription: string
    damageDetails: string
    status: string
  }
}

const statusColors = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800", 
  UNDER_REVIEW: "bg-purple-100 text-purple-800",
  APPROVED: "bg-green-100 text-green-800",
  DENIED: "bg-red-100 text-red-800",
  CLOSED: "bg-gray-100 text-gray-800"
}

export default function InspectionDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [inspectionId, setInspectionId] = useState<string>("")
  const [inspection, setInspection] = useState<InspectionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    inspectionDate: "",
    inspectorNotes: "",
    damageAssessment: ""
  })

  useEffect(() => {
    params.then(({ id }) => {
      setInspectionId(id)
      fetchInspection(id)
    })
  }, [params])

  const fetchInspection = async (id: string) => {
    try {
      const response = await fetch(`/api/inspections/${id}`)
      const data = await response.json()
      
      if (response.ok) {
        setInspection(data)
        setFormData({
          inspectionDate: data.inspectionDate.split('T')[0],
          inspectorNotes: data.inspectorNotes || "",
          damageAssessment: data.damageAssessment || ""
        })
      } else {
        console.error("Failed to fetch inspection:", data.error)
      }
    } catch (error) {
      console.error("Error fetching inspection:", error)
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
      const response = await fetch(`/api/inspections/${inspectionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedInspection = await response.json()
        setInspection(updatedInspection)
        setEditing(false)
      } else {
        const error = await response.json()
        console.error("Failed to update inspection:", error)
      }
    } catch (error) {
      console.error("Error updating inspection:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (inspection) {
      setFormData({
        inspectionDate: inspection.inspectionDate.split('T')[0],
        inspectorNotes: inspection.inspectorNotes || "",
        damageAssessment: inspection.damageAssessment || ""
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

  if (!inspection) {
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
            <h1 className="text-3xl font-bold">Inspection Not Found</h1>
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
            <h1 className="text-3xl font-bold">Inspection Details</h1>
            <p className="text-muted-foreground mt-2">
              Inspected on {formatDate(inspection.inspectionDate)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
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
        {/* Related Claim */}
        <Card>
          <CardHeader>
            <CardTitle>Related Claim</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Claim Number</Label>
              <div className="font-medium">{inspection.claim.claimNumber}</div>
            </div>
            
            <div>
              <Label>Client</Label>
              <div className="font-medium">{inspection.claim.clientName}</div>
            </div>
            
            <div>
              <Label>Status</Label>
              <div>{getStatusBadge(inspection.claim.status)}</div>
            </div>

            <div>
              <Label>Item Description</Label>
              <div className="font-medium">{inspection.claim.itemDescription}</div>
            </div>

            <div className="pt-2">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/claims/${inspection.claim.id}`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Full Claim
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inspector Info */}
        <Card>
          <CardHeader>
            <CardTitle>Inspector Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Inspector</Label>
              <div className="font-medium">
                {inspection.inspector.firstName} {inspection.inspector.lastName}
              </div>
            </div>
            
            <div>
              <Label>Email</Label>
              <div className="font-medium">{inspection.inspector.email}</div>
            </div>
            
            <div>
              <Label>Inspection Date</Label>
              {editing ? (
                <Input
                  type="date"
                  value={formData.inspectionDate}
                  onChange={(e) => handleInputChange("inspectionDate", e.target.value)}
                />
              ) : (
                <div className="font-medium">{formatDate(inspection.inspectionDate)}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <CardDescription>
              {inspection.photos.length} photo{inspection.photos.length !== 1 ? 's' : ''} uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inspection.photos.length === 0 ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No photos uploaded</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {inspection.photos.map((photo, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <CldImage
                      src={photo}
                      alt={`Inspection photo ${index + 1}`}
                      width={300}
                      height={300}
                      deliveryType="fetch"
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => window.open(photo, '_blank')}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Damage Assessment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Inspector Notes</Label>
                <div className="mt-2">
                  {inspection.inspectorNotes ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                <Label>Damage Assessment</Label>
                <div className="mt-2">
                  {inspection.damageAssessment ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inspector Notes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Inspector Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <Textarea
                value={formData.inspectorNotes}
                onChange={(e) => handleInputChange("inspectorNotes", e.target.value)}
                placeholder="Enter general observations, conditions, or notes..."
                rows={4}
              />
            ) : (
              <div className="whitespace-pre-wrap">
                {inspection.inspectorNotes || "No notes provided yet."}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Damage Assessment */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Damage Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <Textarea
                value={formData.damageAssessment}
                onChange={(e) => handleInputChange("damageAssessment", e.target.value)}
                placeholder="Provide detailed assessment of damage, repair recommendations, estimated costs..."
                rows={6}
              />
            ) : (
              <div className="whitespace-pre-wrap">
                {inspection.damageAssessment || "Assessment not completed yet."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}