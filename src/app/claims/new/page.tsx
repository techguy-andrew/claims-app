"use client"

import { useState } from "react"
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
  CardTitle 
} from "@/components/ui"

export default function NewClaimPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    itemDescription: "",
    damageDetails: "",
    incidentDate: "",
    sequentialNumber: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // For now, we'll use dummy organization and user IDs
      // In a real app, these would come from authentication context
      const payload = {
        ...formData,
        sequentialNumber: formData.sequentialNumber ? parseInt(formData.sequentialNumber) : undefined,
        organizationId: "dummy-org-id",
        createdById: "dummy-user-id"
      }

      const response = await fetch("/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const newClaim = await response.json()
        router.push(`/claims/${newClaim.id}`)
      } else {
        const error = await response.json()
        console.error("Failed to create claim:", error)
        alert("Failed to create claim. Please try again.")
      }
    } catch (error) {
      console.error("Error creating claim:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="secondary" 
          onClick={() => router.push('/claims')}
        >
          ← Back to Claims
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Claim</h1>
          <p className="text-gray-600 mt-1">
            Create a new insurance claim
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>
              Enter the client details for this claim
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="Enter client full name"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="clientPhone">Phone</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claim Details */}
        <Card>
          <CardHeader>
            <CardTitle>Claim Details</CardTitle>
            <CardDescription>
              Provide details about the incident and damage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="itemDescription">Item Description *</Label>
              <Textarea
                id="itemDescription"
                value={formData.itemDescription}
                onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                placeholder="Describe the item(s) involved in the claim..."
                rows={3}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="damageDetails">Damage Details *</Label>
              <Textarea
                id="damageDetails"
                value={formData.damageDetails}
                onChange={(e) => handleInputChange('damageDetails', e.target.value)}
                placeholder="Describe the damage in detail..."
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="incidentDate">Incident Date</Label>
                <Input
                  id="incidentDate"
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="sequentialNumber">Sequential Number (Optional)</Label>
                <Input
                  id="sequentialNumber"
                  type="number"
                  value={formData.sequentialNumber}
                  onChange={(e) => handleInputChange('sequentialNumber', e.target.value)}
                  placeholder="Leave blank for auto-assignment"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => router.push('/claims')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            loading={loading}
          >
            💾 Create Claim
          </Button>
        </div>
      </form>
    </div>
  )
}