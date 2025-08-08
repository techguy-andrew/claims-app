"use client"

import { useState, useEffect, useCallback, useMemo, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Plus, FileText, Search, X } from "lucide-react"
import { ClaimCard } from "@/components/claim-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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

// Custom debounce hook for search performance
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Clean empty state component
const EmptyState = () => (
  <div className="text-center py-12 px-4">
    <div className="bg-white rounded-lg border border-gray-200 p-12 shadow-lg max-w-lg mx-auto">
      <div className="p-4 bg-gray-50 rounded-lg w-fit mx-auto mb-6">
        <FileText className="h-8 w-8 text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">No claims yet</h3>
      <p className="text-sm text-gray-600 mb-6">Get started by creating your first claim</p>
      <Button 
        onClick={() => window.location.href = '/claims/new'}
        variant="modern"
        size="small"
        className="mx-auto"
      >
        <Plus className="h-4 w-4" />
        Create First Claim
      </Button>
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
  const [searchTerm, setSearchTerm] = useState("")
  
  // Debounced search term for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

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

  // Search filtering function
  const searchClaims = useCallback((claims: Claim[], searchTerm: string): Claim[] => {
    if (!searchTerm.trim()) return claims
    
    const lowerSearchTerm = searchTerm.toLowerCase().trim()
    
    return claims.filter(claim => {
      // Search across all relevant fields
      const searchableFields = [
        claim.claimNumber,
        claim.clientName,
        claim.insuranceCompany,
        claim.adjustorName,
        claim.adjustorEmail,
        claim.clientPhone,
        claim.clientAddress,
        formatStatus(claim.status) // Search formatted status (e.g., "In Progress")
      ]
      
      return searchableFields.some(field => 
        field && field.toLowerCase().includes(lowerSearchTerm)
      )
    })
  }, [])

  // Combined filtering with memoization for performance
  const filteredClaims = useMemo(() => {
    // First apply status filter
    const statusFiltered = activeStatus === "All" 
      ? claims 
      : claims.filter(claim => claim.status === activeStatus)
    
    // Then apply search filter
    return searchClaims(statusFiltered, debouncedSearchTerm)
  }, [claims, activeStatus, debouncedSearchTerm, searchClaims])

  const handleClaimClick = (claim: Claim) => {
    router.push(`/claims/${claim.id}`)
  }

  // Main render with clean design
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Claims content */}
      <main className="px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 mb-1">Claims</h1>
                  <p className="text-sm text-gray-600">Manage and track insurance claims</p>
                </div>
                <Button 
                  onClick={() => router.push('/claims/new')}
                  variant="modern"
                  size="small"
                >
                  <Plus className="h-4 w-4" />
                  New Claim
                </Button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search claims by number, client, company, adjustor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                rightIcon={searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:bg-gray-100 rounded-lg p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                className="bg-white border border-gray-200 rounded-lg text-sm py-3 px-4 shadow-lg focus:shadow-xl transition-all duration-200"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {FILTER_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  ${activeStatus === status
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                {formatStatus(status)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg max-w-md mx-auto">
                <p className="text-sm text-gray-700">Loading claims...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg max-w-md mx-auto">
                <p className="text-sm text-red-600 mb-4">Error loading claims: {error}</p>
                <Button
                  onClick={fetchClaims}
                  variant="modern"
                  size="small"
                >
                  Try Again
                </Button>
              </div>
            </div>
        ) : claims.length === 0 ? (
          <EmptyState />
          ) : filteredClaims.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="bg-white rounded-lg border border-gray-200 p-12 shadow-lg max-w-lg mx-auto">
                <div className="p-4 bg-gray-50 rounded-lg w-fit mx-auto mb-6">
                  <Search className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {debouncedSearchTerm ? "No matching claims found" : "No claims match this status"}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {debouncedSearchTerm 
                    ? `Try adjusting your search "${debouncedSearchTerm}" or clearing filters`
                    : "Try selecting a different filter or create a new claim"
                  }
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {debouncedSearchTerm && (
                    <Button 
                      onClick={() => setSearchTerm("")}
                      variant="modern"
                      size="small"
                    >
                      Clear Search
                    </Button>
                  )}
                  {activeStatus !== "All" && (
                    <Button 
                      onClick={() => setActiveStatus("All")}
                      variant={debouncedSearchTerm ? "secondary" : "modern"}
                      size="small"
                    >
                      Show All Statuses
                    </Button>
                  )}
                  <Button 
                    onClick={() => router.push('/claims/new')}
                    variant="modern"
                    size="small"
                  >
                    Create New Claim
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Results count */}
              <p className="text-sm text-gray-600 mb-6">
                {filteredClaims.length} {filteredClaims.length === 1 ? 'claim' : 'claims'}
                {activeStatus !== "All" && ` with status "${formatStatus(activeStatus)}"`}
                {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
              </p>
              
              {/* Claims cards */}
              <div className="space-y-4">
                {filteredClaims.map((claim) => (
                  <ClaimCard 
                    key={claim.id}
                    claimNumber={claim.claimNumber}
                    clientName={claim.clientName}
                    insuranceCompany={claim.insuranceCompany}
                    status={claim.status}
                    onClick={() => handleClaimClick(claim)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

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