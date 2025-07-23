"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
        const claim = await response.json()
        router.push(`/claims/${claim.id}`)
      } else {
        const error = await response.json()
        console.error("Failed to create claim:", error)
        // TODO: Show error toast/notification
      }
    } catch (error) {
      console.error("Error creating claim:", error)
      // TODO: Show error toast/notification
    } finally {
      setLoading(false)
    }
  }

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
          <h1 className="text-3xl font-bold">New Claim</h1>
          <p className="text-muted-foreground mt-2">
            Create a new insurance claim
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>
                Details about the client filing the claim
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  placeholder="Enter client's full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="clientEmail">Email Address</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="clientPhone">Phone Number</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </CardContent>
          </Card>

          {/* Claim Details */}
          <Card>
            <CardHeader>
              <CardTitle>Claim Details</CardTitle>
              <CardDescription>
                Information about the claim and incident
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sequentialNumber">
                  Claim Number
                  <span className="text-sm text-muted-foreground ml-2">
                    (Leave blank for auto-generated)
                  </span>
                </Label>
                <Input
                  id="sequentialNumber"
                  type="number"
                  min="1"
                  value={formData.sequentialNumber}
                  onChange={(e) => handleInputChange("sequentialNumber", e.target.value)}
                  placeholder="Auto-generated if blank"
                />
              </div>

              <div>
                <Label htmlFor="incidentDate">Incident Date</Label>
                <Input
                  id="incidentDate"
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => handleInputChange("incidentDate", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="itemDescription">Item Description *</Label>
                <Input
                  id="itemDescription"
                  value={formData.itemDescription}
                  onChange={(e) => handleInputChange("itemDescription", e.target.value)}
                  placeholder="Describe the item that was damaged"
                  required
                />
              </div>

              <div>
                <Label htmlFor="damageDetails">Damage Details *</Label>
                <Textarea
                  id="damageDetails"
                  value={formData.damageDetails}
                  onChange={(e) => handleInputChange("damageDetails", e.target.value)}
                  placeholder="Provide detailed description of the damage..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Creating..." : "Create Claim"}
          </Button>
        </div>
      </form>
    </div>
  )
}