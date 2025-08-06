"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Plus } from "lucide-react"
import { 
  Button, 
  Input, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  Badge
} from "@/components/ui"
import { TopBar } from '@/components/navigation/topbar'
import { useSidebar } from '@/components/navigation'
import { ErrorBoundary } from '@/components/error-boundary'
import { LoadingCard } from '@/components/loading'
import { useDebounce } from '@/hooks/use-debounce'

interface Claim {
  id: string
  claimNumber: string
  clientName: string
  itemDescription: string
  status: 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'CLOSED'
  claimDate: string
  createdBy: {
    firstName: string | null
    lastName: string | null
  }
}

interface ClaimsResponse {
  claims: Claim[]
  total: number
  page: number
  limit: number
}

// Status configuration with proper typing
const STATUS_CONFIG = {
  OPEN: { variant: 'primary' as const, text: 'Open' },
  IN_PROGRESS: { variant: 'warning' as const, text: 'In Progress' },
  UNDER_REVIEW: { variant: 'secondary' as const, text: 'Under Review' },
  APPROVED: { variant: 'success' as const, text: 'Approved' },
  DENIED: { variant: 'error' as const, text: 'Denied' },
  CLOSED: { variant: 'secondary' as const, text: 'Closed' }
} as const

// Filter options
const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DENIED', label: 'Denied' },
  { value: 'CLOSED', label: 'Closed' }
]

function ClaimsPageContent() {
  const router = useRouter()
  const { toggle } = useSidebar()
  
  // State management
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page] = useState(1)

  // Debounced search for better performance
  const debouncedSearch = useDebounce(search, 300)

  // Fetch claims function
  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10"
      })
      
      if (debouncedSearch) {
        params.append("search", debouncedSearch)
      }
      if (statusFilter) {
        params.append("status", statusFilter)
      }
      
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
  }, [debouncedSearch, statusFilter, page])

  // Load claims on component mount and when filters change
  useEffect(() => {
    fetchClaims()
  }, [fetchClaims])

  // Utility functions
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  const getStatusBadge = (status: Claim['status']) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.CLOSED
    
    return (
      <Badge variant={config.variant}>
        {config.text}
      </Badge>
    )
  }

  const getCreatedByName = (createdBy: Claim['createdBy']): string => {
    if (!createdBy.firstName && !createdBy.lastName) {
      return 'Unknown'
    }
    return `${createdBy.firstName || ''} ${createdBy.lastName || ''}`.trim()
  }

  const handleViewClaim = (claimId: string) => {
    router.push(`/claims/${claimId}`)
  }

  // Loading state
  if (loading) {
    return (
      <>
        <TopBar
          title="Claims"
          subtitle="Manage and track all insurance claims"
          showMenuButton={true}
          onMenuToggle={toggle}
          actions={
            <Link href="/claims/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Claim
              </Button>
            </Link>
          }
        />
        <div className="p-6 space-y-6">
          <LoadingCard 
            title="Loading claims..." 
            description="Please wait while we fetch your claims data"
          />
        </div>
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <>
        <TopBar
          title="Claims"
          subtitle="Manage and track all insurance claims"
          showMenuButton={true}
          onMenuToggle={toggle}
          actions={
            <Link href="/claims/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Claim
              </Button>
            </Link>
          }
        />
        <div className="p-6 space-y-6">
          <ErrorBoundary onError={(error) => console.error('Claims error:', error)}>
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-red-600 mb-4">Error loading claims: {error}</p>
                <Button onClick={fetchClaims} variant="secondary">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </ErrorBoundary>
        </div>
      </>
    )
  }

  // Main render
  return (
    <>
      <TopBar
        title="Claims"
        subtitle="Manage and track all insurance claims"
        showMenuButton={true}
        onMenuToggle={toggle}
        actions={
          <Link href="/claims/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Claim
            </Button>
          </Link>
        }
      />
      
      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by claim #, client name, or item..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Claims Table */}
        <Card>
          <CardHeader>
            <CardTitle>Claims List</CardTitle>
            <CardDescription>
              {claims.length} claim{claims.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {claims.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  {debouncedSearch || statusFilter 
                    ? "No claims match your current filters." 
                    : "No claims found. Create your first claim to get started."
                  }
                </div>
                {(!debouncedSearch && !statusFilter) && (
                  <Link href="/claims/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Claim
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim #</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell>
                          <span className="font-medium font-mono text-sm">
                            {claim.claimNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {claim.clientName}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div 
                            className="max-w-xs truncate" 
                            title={claim.itemDescription}
                          >
                            {claim.itemDescription}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(claim.status)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {formatDate(claim.claimDate)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {getCreatedByName(claim.createdBy)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="secondary" 
                            size="small"
                            onClick={() => handleViewClaim(claim.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Main export with error boundary
export default function ClaimsPage() {
  return (
    <ErrorBoundary onError={(error, errorInfo) => {
      console.error('Claims page error:', error, errorInfo);
    }}>
      <Suspense fallback={<LoadingCard title="Loading claims page..." />}>
        <ClaimsPageContent />
      </Suspense>
    </ErrorBoundary>
  )
}