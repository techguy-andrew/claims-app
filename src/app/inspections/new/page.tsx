"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PhotoUpload } from "@/components/photo-upload"

export default function NewInspectionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    claimId: "",
    inspectionDate: new Date().toISOString().split('T')[0],
    inspectorNotes: "",
    damageAssessment: "",
    photos: [] as string[]
  })

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // For now, we'll use dummy inspector ID
      // In a real app, this would come from authentication context
      const payload = {
        ...formData,
        inspectorId: "dummy-inspector-id"
      }

      const response = await fetch("/api/inspections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const inspection = await response.json()
        router.push(`/inspections/${inspection.id}`)
      } else {
        const error = await response.json()
        console.error("Failed to create inspection:", error)
        // TODO: Show error toast/notification
      }
    } catch (error) {
      console.error("Error creating inspection:", error)
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
          <h1 className="text-3xl font-bold">New Inspection</h1>
          <p className="text-muted-foreground mt-2">
            Create a new property inspection
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Inspection Details */}
          <Card>
            <CardHeader>
              <CardTitle>Inspection Details</CardTitle>
              <CardDescription>
                Basic information about the inspection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="claimId">Claim ID *</Label>
                <Input
                  id="claimId"
                  value={formData.claimId}
                  onChange={(e) => handleInputChange("claimId", e.target.value)}
                  placeholder="Enter the claim ID"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can find the claim ID in the claims dashboard
                </p>
              </div>
              
              <div>
                <Label htmlFor="inspectionDate">Inspection Date *</Label>
                <Input
                  id="inspectionDate"
                  type="date"
                  value={formData.inspectionDate}
                  onChange={(e) => handleInputChange("inspectionDate", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>
                Upload photos of the damage or property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhotoUpload
                value={formData.photos}
                onChange={(photos) => handleInputChange("photos", photos)}
                maxFiles={20}
              />
            </CardContent>
          </Card>

          {/* Inspector Notes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Inspector Notes</CardTitle>
              <CardDescription>
                Detailed notes about the inspection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="inspectorNotes">General Notes</Label>
                <Textarea
                  id="inspectorNotes"
                  value={formData.inspectorNotes}
                  onChange={(e) => handleInputChange("inspectorNotes", e.target.value)}
                  placeholder="Enter any general observations, conditions, or notes..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="damageAssessment">Damage Assessment</Label>
                <Textarea
                  id="damageAssessment"
                  value={formData.damageAssessment}
                  onChange={(e) => handleInputChange("damageAssessment", e.target.value)}
                  placeholder="Provide detailed assessment of damage, repair recommendations, estimated costs..."
                  rows={6}
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
            {loading ? "Creating..." : "Create Inspection"}
          </Button>
        </div>
      </form>
    </div>
  )
}