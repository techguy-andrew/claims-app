"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
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

interface Claim {
  id: string
  claimNumber: string
  sequentialNumber: number
  clientName: string
  itemDescription: string
  status: string
  claimDate: string
  createdBy: {
    firstName: string | null
    lastName: string | null
  }
  inspections: Array<{
    id: string
    inspectionDate: string
  }>
}

export default function ClaimsPage() {
  const router = useRouter()
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page] = useState(1)

  // Debounce search input for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const fetchClaims = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10"
      })
      
      if (debouncedSearch) params.append("search", debouncedSearch)
      if (statusFilter) params.append("status", statusFilter)
      
      const response = await fetch(`/api/claims?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setClaims(data.claims)
      } else {
        console.error("Failed to fetch claims:", data.error)
      }
    } catch (error) {
      console.error("Error fetching claims:", error)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, statusFilter, page])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      OPEN: { variant: 'primary' as const, text: 'Open' },
      IN_PROGRESS: { variant: 'warning' as const, text: 'In Progress' },
      UNDER_REVIEW: { variant: 'secondary' as const, text: 'Under Review' },
      APPROVED: { variant: 'success' as const, text: 'Approved' },
      DENIED: { variant: 'error' as const, text: 'Denied' },
      CLOSED: { variant: 'default' as const, text: 'Closed' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.CLOSED
    
    return (
      <Badge variant={config.variant}>
        {config.text}
      </Badge>
    )
  }

  useEffect(() => {
    const loadClaims = async () => {
      await fetchClaims()
    }
    loadClaims()
  }, [fetchClaims])

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Claims</h1>
            <p className="text-gray-600 mt-2">
              Manage and track all insurance claims
            </p>
          </div>
        </div>
        <Card>
          <CardContent>
            <div className="text-center py-8">
              Loading claims...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Claims</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all insurance claims
          </p>
        </div>
        <Button onClick={() => router.push('/claims/new')}>
          <span style={{ marginRight: '0.5rem' }}>+</span>
          New Claim
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search by claim #, client name, or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path 
                    d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="Filter by status"
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'OPEN', label: 'Open' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'UNDER_REVIEW', label: 'Under Review' },
                { value: 'APPROVED', label: 'Approved' },
                { value: 'DENIED', label: 'Denied' },
                { value: 'CLOSED', label: 'Closed' }
              ]}
            />
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
            <div className="text-center py-8 text-gray-500">
              No claims found. Create your first claim to get started.
            </div>
          ) : (
            <Table responsive>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Inspections</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell>
                      <span className="font-medium">#{claim.sequentialNumber}</span>
                    </TableCell>
                    <TableCell>{claim.clientName}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={claim.itemDescription}>
                        {claim.itemDescription}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(claim.status)}
                    </TableCell>
                    <TableCell>
                      {formatDate(claim.claimDate)}
                    </TableCell>
                    <TableCell>
                      {claim.createdBy.firstName} {claim.createdBy.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" badgeStyle="outline">
                        {claim.inspections.length} inspection{claim.inspections.length !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => router.push(`/claims/${claim.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}