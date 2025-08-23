"use client"

import { useState, useEffect, useCallback, useMemo, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Plus, FileText, Search, X } from "lucide-react"
import { 
  Library001ClaimCard, 
  Library001Input, 
  Library001Button, 
  Library001ErrorBoundary,
  Library001Card
} from '@/components-library001'

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

// Clean empty state component - Mobile Optimized
const EmptyState = () => (
  <div className="text-center py-12 px-4">
    <Library001Card variant="enterprise" padding="lg" className="max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 mx-auto mb-6 flex items-center justify-center">
        <FileText className="h-9 w-9 md:h-8 md:w-8 text-gray-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4 md:mb-3 leading-tight">No claims yet</h3>
      <p className="text-sm text-gray-600 mb-8 md:mb-6 leading-relaxed">Get started by creating your first claim</p>
      <Library001Button 
        onClick={() => window.location.href = '/claims/new'}
        variant="modern"
        size="lg"
        fullWidth
        className="mx-auto sm:w-auto"
      >
        <Plus className="h-5 w-5 mr-2" />
        Create First Claim
      </Library001Button>
    </Library001Card>
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
          {/* Page Header - Mobile Optimized */}
          <div className="mb-8">
            <Library001Card variant="enterprise" padding="default">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="thumbnail-modern p-3 flex items-center justify-center min-h-[48px] md:min-h-[44px] min-w-[48px] md:min-w-[44px]">
                    <FileText className="h-7 w-7 md:h-6 md:w-6 text-gray-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-xl font-semibold text-gray-900 mb-2 md:mb-1 tracking-tight leading-tight">Claims</h1>
                    <p className="text-sm text-gray-600 leading-relaxed">Manage and track insurance claims</p>
                  </div>
                </div>
                <Library001Button 
                  onClick={() => router.push('/claims/new')}
                  variant="modern"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Claim
                </Library001Button>
              </div>
            </Library001Card>
          </div>

          {/* Search Bar - Mobile Optimized */}
          <div className="mb-8">
            <Library001Card variant="glass" padding="sm">
              <div className="relative">
                <Library001Input
                  type="text"
                  placeholder="Search claims..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="h-5 w-5 md:h-4 md:w-4" />}
                  fullWidth
                  className="bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-xl focus:bg-white/80 transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-100 active:bg-gray-200 rounded-xl p-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <X className="h-5 w-5 md:h-4 md:w-4" />
                  </button>
                )}
              </div>
            </Library001Card>
          </div>

          {/* Filter Buttons - Mobile Optimized */}
          <div className="flex flex-wrap gap-3 mb-8">
            {FILTER_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`
                  px-5 py-3.5 md:px-4 md:py-3 rounded-xl text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/30 touch-target-lg min-h-[48px] md:min-h-[44px] active:scale-95
                  ${activeStatus === status
                    ? 'bg-blue-50/90 text-blue-700 border border-blue-200/80 shadow-sm backdrop-blur-sm'
                    : 'bg-white/80 text-gray-700 border border-gray-200/60 hover:bg-white/95 active:bg-gray-50 backdrop-blur-sm'
                  }
                `}
              >
                {formatStatus(status)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Library001Card variant="enterprise" padding="lg" className="max-w-md mx-auto">
                <p className="text-sm text-gray-700">Loading claims...</p>
              </Library001Card>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Library001Card variant="enterprise" padding="lg" className="max-w-md mx-auto">
                <p className="text-sm text-red-600 mb-6 leading-relaxed">Error loading claims: {error}</p>
                <Library001Button
                  onClick={fetchClaims}
                  variant="modern"
                >
                  Try Again
                </Library001Button>
              </Library001Card>
            </div>
        ) : claims.length === 0 ? (
          <EmptyState />
          ) : filteredClaims.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Library001Card variant="enterprise" padding="lg" className="max-w-lg mx-auto">
                <div className="thumbnail-modern p-4 mx-auto mb-6 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {debouncedSearchTerm ? "No matching claims found" : "No claims match this status"}
                </h3>
                <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                  {debouncedSearchTerm 
                    ? `Try adjusting your search "${debouncedSearchTerm}" or clearing filters`
                    : "Try selecting a different filter or create a new claim"
                  }
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  {debouncedSearchTerm && (
                    <Library001Button 
                      onClick={() => setSearchTerm("")}
                      variant="modern"
                    >
                      Clear Search
                    </Library001Button>
                  )}
                  {activeStatus !== "All" && (
                    <Library001Button 
                      onClick={() => setActiveStatus("All")}
                      variant={debouncedSearchTerm ? "secondary" : "modern"}
                    >
                      Show All Statuses
                    </Library001Button>
                  )}
                  <Library001Button 
                    onClick={() => router.push('/claims/new')}
                    variant="modern"
                  >
                    Create New Claim
                  </Library001Button>
                </div>
              </Library001Card>
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
                  <Library001ClaimCard 
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
    <Library001ErrorBoundary onError={(error, errorInfo) => {
      console.error('Claims page error:', error, errorInfo);
    }}>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Loading claims page...</p>
        </div>
      }>
        <ClaimsPageContent />
      </Suspense>
    </Library001ErrorBoundary>
  )
}