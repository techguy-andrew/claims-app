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
  Badge 
} from "@/components/ui"
import { TopBar } from '@/components/navigation/topbar'
import { useSidebar } from '@/components/navigation'

interface Inspection {
  id: string
  inspectionNumber: string
  inspectionDate: string
  inspectorNotes: string | null
  damageAssessment: string | null
  photos: string[]
  inspector: {
    firstName: string | null
    lastName: string | null
  }
  claim: {
    claimNumber: string
    clientName: string
    itemDescription: string
    status: string
  }
}

const statusColors = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800", 
  UNDER_REVIEW: "bg-purple-100 text-purple-800",
  APPROVED: "bg-green-100 text-green-800",
  DENIED: "bg-red-100 text-red-800",
  CLOSED: "bg-gray-100 text-gray-800"
}

export default function InspectionsPage() {
  const router = useRouter()
  const { toggle } = useSidebar()
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page] = useState(1)

  // Debounce search input for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const fetchInspections = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10"
      })
      
      if (debouncedSearch) params.append("search", debouncedSearch)
      
      const response = await fetch(`/api/inspections?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setInspections(data.inspections || [])
      } else {
        console.error("Failed to fetch inspections:", data.error)
        console.error("Response status:", response.status)
        console.error("Response data:", data)
      }
    } catch (error) {
      console.error("Error fetching inspections:", error)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, page])

  const getStatusBadge = (status: string) => {
    const colorClass = statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
    return (
      <Badge variant="secondary" className={colorClass}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  useEffect(() => {
    fetchInspections()
  }, [fetchInspections])

  if (loading) {
    return (
      <>
        <TopBar
          title="Inspections"
          subtitle="Manage property inspections and assessments"
          showMenuButton={true}
          onMenuToggle={toggle}
        />
        <div className="p-6 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                Loading inspections...
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar
        title="Inspections"
        subtitle="Manage property inspections and assessments"
        showMenuButton={true}
        onMenuToggle={toggle}
        actions={
          <Button onClick={() => router.push('/inspections/new')}>
            + New Inspection
          </Button>
        }
      />
      <div className="p-6 space-y-6">

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              placeholder="Search by claim number, client name, or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Inspections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inspections List</CardTitle>
          <CardDescription>
            {inspections.length} inspection{inspections.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inspections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No inspections found. Create your first inspection to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inspection #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Claim #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Photos</TableHead>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.map((inspection) => (
                  <TableRow key={inspection.id}>
                    <TableCell className="font-medium">
{inspection.inspectionNumber}
                    </TableCell>
                    <TableCell>
                      {formatDate(inspection.inspectionDate)}
                    </TableCell>
                    <TableCell className="font-medium">
{inspection.claim.claimNumber}
                    </TableCell>
                    <TableCell>{inspection.claim.clientName}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {inspection.claim.itemDescription}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(inspection.claim.status)}
                    </TableCell>
                    <TableCell>
                      {inspection.inspector.firstName} {inspection.inspector.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        📷 {inspection.photos.length} photo{inspection.photos.length !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {inspection.damageAssessment ? (
                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => router.push(`/inspections/${inspection.id}`)}
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
    </>
  )
}