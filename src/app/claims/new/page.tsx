"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, AlertCircle } from "lucide-react"
import { ClaimForm } from "@/components/claim-form"
import { ClaimFormData } from "@/lib/form-validation"

export default function NewClaimPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: ClaimFormData & { organizationId: string; createdById: string }) => {
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
      <div>
        {/* Animation styles */}
        <style jsx>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>

        <div className="pt-20 p-4 sm:p-6">
          <div className="max-w-md mx-auto text-center" style={{ animation: 'fadeIn 0.8s ease-out' }}>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50">
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl w-fit mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Claim Created Successfully!</h1>
              <p className="text-gray-600">Redirecting to claim details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="pt-20 p-4 sm:p-6 pb-24">
        {/* Page Header */}
        <div className="text-center mb-8" style={{ animation: 'fadeIn 0.8s ease-out' }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Claim</h1>
          <p className="text-gray-600">Fill out the form below to create a new insurance claim</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6" style={{ animation: 'slideUp 0.6s ease-out' }}>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Creating Claim</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Claim Form */}
        <div className="max-w-2xl mx-auto" style={{ animation: 'slideUp 0.6s ease-out 100ms both' }}>
          <ClaimForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            submitText="Create Claim"
            cancelText="Cancel"
          />
        </div>
      </div>
    </div>
  )
}