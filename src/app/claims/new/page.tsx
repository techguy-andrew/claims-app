"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Library001ClaimForm, Library001Card, type Library001ClaimFormData } from '@/components-library001'

export default function NewClaimPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: Library001ClaimFormData & { organizationId: string; createdById: string }) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create claim')
      }

      const newClaim = await response.json()
      setSuccess(true)
      
      // Redirect to the new claim's detail page after a brief success display
      setTimeout(() => {
        router.push(`/claims/${newClaim.id}`)
      }, 1500)
    } catch (err) {
      console.error('Error creating claim:', err)
      setError(err instanceof Error ? err.message : 'Failed to create claim')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/claims')
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="px-4 sm:px-6 py-8">
          <div className="max-w-md mx-auto text-center">
            <Library001Card variant="enterprise" padding="lg">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-3 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900 mb-2">Claim Created Successfully!</h1>
              <p className="text-sm text-gray-600">Redirecting to claim details...</p>
            </Library001Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <Library001Card variant="enterprise" padding="default">
              <div>
                <h1 className="text-lg font-semibold text-gray-900 mb-1">Create New Claim</h1>
                <p className="text-sm text-gray-600">Fill out the form below to create a new insurance claim</p>
              </div>
            </Library001Card>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6">
              <Library001Card variant="bordered" padding="sm" className="bg-red-50 border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error Creating Claim</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </Library001Card>
            </div>
          )}

          {/* Claim Form */}
          <div>
            <Library001ClaimForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
              submitText="Create Claim"
              cancelText="Cancel"
            />
          </div>
        </div>
      </main>
    </div>
  )
}