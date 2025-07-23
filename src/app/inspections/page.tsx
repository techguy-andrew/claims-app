"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Calendar, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Inspection {
  id: string
  sequentialNumber: number
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
    sequentialNumber: number
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
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchInspections = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10"
      })
      
      const response = await fetch(`/api/inspections?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setInspections(data.inspections)
      } else {
        console.error("Failed to fetch inspections:", data.error)
      }
    } catch (error) {
      console.error("Error fetching inspections:", error)
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => {
    fetchInspections()
  }, [fetchInspections])
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10"
      })
      
      const response = await fetch(`/api/inspections?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setInspections(data.inspections)
      } else {
        console.error("Failed to fetch inspections:", data.error)
      }
    } catch (error) {
      console.error("Error fetching inspections:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colorClass = statusColors[status as keyof typeof statusColors] || statusColors.OPEN
    return (
      <Badge className={colorClass}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inspections</h1>
            <p className="text-muted-foreground mt-2">
              Manage property inspections and assessments
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              Loading inspections...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inspections</h1>
          <p className="text-muted-foreground mt-2">
            Manage property inspections and assessments
          </p>
        </div>
        <Button onClick={() => router.push('/inspections/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Inspection
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by claim number, client name, or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
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
                      #{inspection.sequentialNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(inspection.inspectionDate)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      #{inspection.claim.sequentialNumber}
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
                      <div className="flex items-center gap-1">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">
                          {inspection.photos.length} photo{inspection.photos.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {inspection.damageAssessment ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
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
  )
}