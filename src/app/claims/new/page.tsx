"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { TopBar } from '@/components/navigation/topbar'
import { useSidebar } from '@/components/navigation'

export default function NewClaimPage() {
  const router = useRouter()
  const { toggle } = useSidebar()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    shipperName: "",
    idNumber: "",
    adjusterName: "",
    adjusterEmail: "",
    adjusterPhone: "",
    contractingCompany: ""
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
    <>
      <TopBar
        title="New Claim"
        subtitle="Create a new insurance claim"
        showMenuButton={true}
        onMenuToggle={toggle}
        actions={
          <Button 
            variant="secondary"
            onClick={() => router.push('/claims')}
          >
            ← Back to Claims
          </Button>
        }
      />
      <div className="p-6 space-y-6">

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipper Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shipper Information</CardTitle>
            <CardDescription>
              Enter the shipper/insured details for this claim
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="shipperName">Name of Shipper/Insured *</Label>
              <Input
                id="shipperName"
                value={formData.shipperName}
                onChange={(e) => handleInputChange('shipperName', e.target.value)}
                placeholder="Enter shipper/insured name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="idNumber">ID Number *</Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                placeholder="Enter ID number"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Adjuster Information */}
        <Card>
          <CardHeader>
            <CardTitle>Adjuster Information</CardTitle>
            <CardDescription>
              Enter the adjuster contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="adjusterName">Adjuster Name *</Label>
              <Input
                id="adjusterName"
                value={formData.adjusterName}
                onChange={(e) => handleInputChange('adjusterName', e.target.value)}
                placeholder="Enter adjuster name"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="adjusterEmail">Adjuster Email *</Label>
                <Input
                  id="adjusterEmail"
                  type="email"
                  value={formData.adjusterEmail}
                  onChange={(e) => handleInputChange('adjusterEmail', e.target.value)}
                  placeholder="adjuster@example.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="adjusterPhone">Adjuster Phone Number *</Label>
                <Input
                  id="adjusterPhone"
                  type="tel"
                  value={formData.adjusterPhone}
                  onChange={(e) => handleInputChange('adjusterPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="contractingCompany">Contracting Company *</Label>
              <Input
                id="contractingCompany"
                value={formData.contractingCompany}
                onChange={(e) => handleInputChange('contractingCompany', e.target.value)}
                placeholder="Enter contracting company name"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Files and Attachments */}
        <PhotoUpload />

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
    </>
  )
}