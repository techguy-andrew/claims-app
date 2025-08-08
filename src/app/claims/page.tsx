"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Plus, FileText } from "lucide-react"
import { ClaimCard } from "@/components/claim-card"
import { ErrorBoundary } from '@/components/error-boundary'

interface Claim {
  id: string
  claimNumber: string
  clientName: string
  insuranceCompany: string
  adjustorName: string
  adjustorEmail: string
  clientPhone: string
  clientAddress: string
  status: 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'CLOSED'
  claimDate: string
  createdBy: {
    firstName: string | null
    lastName: string | null
  }
}

interface ClaimsResponse {
  claims: Claim[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

// Available claim statuses for filtering
const FILTER_STATUSES = [
  "All",
  "OPEN",
  "IN_PROGRESS", 
  "UNDER_REVIEW",
  "APPROVED",
  "DENIED",
  "CLOSED"
] as const

// Helper function to format status for display
const formatStatus = (status: string): string => {
  if (status === "All") return "All"
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

// Premium empty state component
const EmptyState = () => (
  <div className="text-center py-12 px-4" style={{ animation: 'fadeIn 0.8s ease-out' }}>
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 max-w-lg mx-auto">
      <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl w-fit mx-auto mb-6">
        <FileText className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">No claims yet</h3>
      <p className="text-gray-600 mb-8">Get started by creating your first premium claim</p>
      <button 
        onClick={() => window.location.href = '/claims/new'}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] flex items-center gap-3 mx-auto"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Create First Claim</span>
      </button>
    </div>
  </div>
)

function ClaimsPageContent() {
  const router = useRouter()
  
  // State management
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeStatus, setActiveStatus] = useState<string>("All")

  // Fetch claims function
  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: "1",
        limit: "50"
      })
      
      
      const response = await fetch(`/api/claims?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: ClaimsResponse = await response.json()
      setClaims(data.claims || [])
    } catch (error) {
      console.error("Error fetching claims:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch claims")
      setClaims([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Load claims on component mount and when filters change
  useEffect(() => {
    fetchClaims()
  }, [fetchClaims])

  // Filter claims based on active status
  const filteredClaims = activeStatus === "All" 
    ? claims 
    : claims.filter(claim => claim.status === activeStatus)

  const handleClaimClick = (claim: Claim) => {
    router.push(`/claims/${claim.id}`)
  }

  // Main render with premium design
  return (
    <div>
      {/* CSS Animation styles */}
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


      {/* Claims content */}
      <main className="pt-20 px-4 sm:px-6 pb-24">
        {/* Page Header */}
        <div className="text-center mb-8" style={{ animation: 'fadeIn 0.8s ease-out' }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Claims</h1>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8" style={{ animation: 'slideUp 0.6s ease-out 100ms both' }}>
          {FILTER_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105
                ${activeStatus === status
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }
              `}
            >
              {formatStatus(status)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 max-w-md mx-auto">
              <p className="text-gray-600">Loading premium claims...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 max-w-md mx-auto">
              <p className="text-red-500 mb-4">Error loading claims: {error}</p>
              <button
                onClick={fetchClaims}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : claims.length === 0 ? (
          <EmptyState />
        ) : filteredClaims.length === 0 ? (
          <div className="text-center py-12 px-4" style={{ animation: 'fadeIn 0.8s ease-out' }}>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 max-w-lg mx-auto">
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl w-fit mx-auto mb-6">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No claims match this status</h3>
              <p className="text-gray-600 mb-8">Try selecting a different filter or create a new claim</p>
              <button 
                onClick={() => setActiveStatus("All")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] mr-4"
              >
                Show All Claims
              </button>
              <button 
                onClick={() => router.push('/claims/new')}
                className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
              >
                Create New Claim
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Results count with animation */}
            <p className="text-sm text-gray-500 mb-6 text-center" style={{ animation: 'slideUp 0.6s ease-out' }}>
              {filteredClaims.length} premium {filteredClaims.length === 1 ? 'claim' : 'claims'}
              {activeStatus !== "All" && ` with status "${formatStatus(activeStatus)}"`}
            </p>
            
            {/* Premium claims cards with staggered animations */}
            <div className="space-y-4">
              {filteredClaims.map((claim, index) => (
                <div
                  key={claim.id}
                  style={{ animation: `slideUp 0.6s ease-out ${(index * 100) + 200}ms both` }}
                >
                  <ClaimCard 
                    claimNumber={claim.claimNumber}
                    clientName={claim.clientName}
                    insuranceCompany={claim.insuranceCompany}
                    status={claim.status}
                    onClick={() => handleClaimClick(claim)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => router.push('/claims/new')}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl px-6 py-4 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] flex items-center gap-2 z-40"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">New Claim</span>
      </button>

    </div>
  )
}

// Main export with error boundary
export default function ClaimsPage() {
  return (
    <ErrorBoundary onError={(error, errorInfo) => {
      console.error('Claims page error:', error, errorInfo);
    }}>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Loading claims page...</p>
        </div>
      }>
        <ClaimsPageContent />
      </Suspense>
    </ErrorBoundary>
  )
}