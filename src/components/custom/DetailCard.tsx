'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ItemCard, ItemCardStack } from './ItemCard'
import { MoreVertical, Check, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

// Types following Prisma schema
interface ClaimData {
  id: string
  claimNumber: string
  insuranceCompany: string | null
  adjustor: string | null
  clientPhone: string | null
  clientAddress: string | null
  claimant: {
    id: string
    name: string | null
    email: string
  }
  items: Array<{
    id: string
    title: string
    description: string | null
  }>
}

export interface DetailCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  claim: ClaimData
  editable?: boolean
}

export function DetailCard({
  claim: initialClaim,
  className,
  editable = false,
  ...props
}: DetailCardProps) {
  const [claim, setClaim] = React.useState<ClaimData>(initialClaim)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  const router = useRouter()

  React.useEffect(() => {
    setClaim(initialClaim)
  }, [initialClaim])

  // Safe defaults for the fields
  const safeClaimNumber = claim.claimNumber || 'Click to edit claim number'
  const safeInsuranceCompany = claim.insuranceCompany || 'Click to edit insurance company'
  const safeClientName = claim.claimant.name || 'Click to edit client name'
  const safeClientPhone = claim.clientPhone || 'Click to edit client phone'
  const safeClientAddress = claim.clientAddress || 'Click to edit client address'

  // Editing state following ItemCard pattern
  const [isEditing, setIsEditing] = React.useState(false)
  const [tempClaimNumber, setTempClaimNumber] = React.useState(safeClaimNumber)
  const [tempInsuranceCompany, setTempInsuranceCompany] = React.useState(safeInsuranceCompany)
  const [tempClientName, setTempClientName] = React.useState(safeClientName)
  const [tempClientPhone, setTempClientPhone] = React.useState(safeClientPhone)
  const [tempClientAddress, setTempClientAddress] = React.useState(safeClientAddress)

  const claimNumberRef = React.useRef<HTMLDivElement>(null)
  const insuranceCompanyRef = React.useRef<HTMLDivElement>(null)
  const clientNameRef = React.useRef<HTMLDivElement>(null)
  const clientPhoneRef = React.useRef<HTMLDivElement>(null)
  const clientAddressRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setTempClaimNumber(safeClaimNumber)
    setTempInsuranceCompany(safeInsuranceCompany)
    setTempClientName(safeClientName)
    setTempClientPhone(safeClientPhone)
    setTempClientAddress(safeClientAddress)
  }, [safeClaimNumber, safeInsuranceCompany, safeClientName, safeClientPhone, safeClientAddress])


  // Handle client name update
  const handleClientNameUpdate = async (name: string) => {
    try {
      const response = await fetch(`/api/users/${claim.claimant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update client name')
      }

      const updatedClaimant = await response.json()
      setClaim(prevClaim => ({
        ...prevClaim,
        claimant: {
          ...prevClaim.claimant,
          name: updatedClaimant.name
        }
      }))
    } catch (error) {
      console.error('Error updating client name:', error)
      toast({
        description: error instanceof Error ? error.message : 'Failed to update client name',
        variant: 'destructive',
      })
    }
  }

  // Handle claim save
  const handleClaimSave = async (data: {
    claimNumber: string
    insuranceCompany: string
    clientPhone: string
    clientAddress: string
  }) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/claims/${claim.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update claim')
      }

      const updatedClaim = await response.json()
      setClaim(updatedClaim)

      toast({
        description: 'Claim updated successfully',
        variant: 'success',
      })
    } catch (error) {
      console.error('Error updating claim:', error)
      toast({
        description: error instanceof Error ? error.message : 'Failed to update claim',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle claim delete
  const handleClaimDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this claim? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/claims/${claim.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete claim')
      }

      toast({
        description: 'Claim deleted successfully',
        variant: 'success',
      })

      router.push('/claims')
    } catch (error) {
      console.error('Error deleting claim:', error)
      toast({
        description: error instanceof Error ? error.message : 'Failed to delete claim',
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  // Handle item save
  const handleItemSave = async (itemId: string, data: { title: string; description: string }) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update item')
      }

      const updatedItem = await response.json()

      setClaim(prevClaim => ({
        ...prevClaim,
        items: prevClaim.items.map(item =>
          item.id === itemId ? { ...item, ...updatedItem } : item
        )
      }))

      toast({
        description: 'Item updated successfully',
        variant: 'success',
      })
    } catch (error) {
      console.error('Error updating item:', error)
      toast({
        description: error instanceof Error ? error.message : 'Failed to update item',
        variant: 'destructive',
      })
    }
  }

  // Handle item delete
  const handleItemDelete = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return
    }

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete item')
      }

      setClaim(prevClaim => ({
        ...prevClaim,
        items: prevClaim.items.filter(item => item.id !== itemId)
      }))

      toast({
        description: 'Item deleted successfully',
        variant: 'success',
      })
    } catch (error) {
      console.error('Error deleting item:', error)
      toast({
        description: error instanceof Error ? error.message : 'Failed to delete item',
        variant: 'destructive',
      })
    }
  }

  // Handle item create
  const handleItemCreate = async (data: { title: string; description: string }) => {
    try {
      const response = await fetch(`/api/claims/${claim.id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create item')
      }

      const newItem = await response.json()

      setClaim(prevClaim => ({
        ...prevClaim,
        items: [...prevClaim.items, newItem]
      }))

      toast({
        description: 'Item created successfully',
        variant: 'success',
      })
    } catch (error) {
      console.error('Error creating item:', error)
      toast({
        description: error instanceof Error ? error.message : 'Failed to create item',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (claimNumberRef.current && insuranceCompanyRef.current && clientNameRef.current && clientPhoneRef.current && clientAddressRef.current) {
      const newClaimNumber = claimNumberRef.current.textContent || ''
      const newInsuranceCompany = insuranceCompanyRef.current.textContent || ''
      const newClientName = clientNameRef.current.textContent || ''
      const newClientPhone = clientPhoneRef.current.textContent || ''
      const newClientAddress = clientAddressRef.current.textContent || ''

      handleClaimSave({
        claimNumber: newClaimNumber,
        insuranceCompany: newInsuranceCompany,
        clientPhone: newClientPhone,
        clientAddress: newClientAddress
      })

      // Update client name separately
      handleClientNameUpdate(newClientName)

      setTempClaimNumber(newClaimNumber)
      setTempInsuranceCompany(newInsuranceCompany)
      setTempClientName(newClientName)
      setTempClientPhone(newClientPhone)
      setTempClientAddress(newClientAddress)
    }
    setIsEditing(false)
  }


  const handleCancel = () => {
    if (claimNumberRef.current && insuranceCompanyRef.current && clientNameRef.current && clientPhoneRef.current && clientAddressRef.current) {
      claimNumberRef.current.textContent = tempClaimNumber
      insuranceCompanyRef.current.textContent = tempInsuranceCompany
      clientNameRef.current.textContent = tempClientName
      clientPhoneRef.current.textContent = tempClientPhone
      clientAddressRef.current.textContent = tempClientAddress
    }
    setIsEditing(false)
  }


  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (isEditing) {
        handleSave()
      }
    }
    if (e.key === 'Escape' && isEditing) {
      e.preventDefault()
      handleCancel()
    }
  }


  const handleNewItem = () => {
    handleItemCreate({
      title: 'New Item',
      description: 'Click to edit description'
    })
  }

  return (
    <Card className={cn('w-full', className)} {...props}>
      <CardHeader>
        <div className="grid grid-cols-[1fr,auto] gap-6 items-start">
          <div
            className={cn(
              "flex flex-col gap-3",
              editable && !isLoading && "cursor-pointer"
            )}
            onDoubleClick={() => editable && !isLoading && !isEditing && handleEdit()}
          >
            <CardTitle className="text-2xl">Claim Details</CardTitle>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">Claim Number</label>
                <div
                  ref={claimNumberRef}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "outline-none min-h-[1.75rem] leading-7 font-semibold",
                    isEditing && "cursor-text border-b border-input"
                  )}
                >
                  {safeClaimNumber}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">Insurance Company / Adjustor</label>
                <div
                  ref={insuranceCompanyRef}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "outline-none min-h-[1.25rem] leading-5 font-semibold",
                    isEditing && "cursor-text border-b border-input"
                  )}
                >
                  {safeInsuranceCompany}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">Client Name</label>
                <div
                  ref={clientNameRef}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "outline-none min-h-[1.25rem] leading-5 font-semibold",
                    isEditing && "cursor-text border-b border-input"
                  )}
                >
                  {safeClientName}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">Client Phone</label>
                <div
                  ref={clientPhoneRef}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "outline-none min-h-[1.25rem] leading-5 font-semibold",
                    isEditing && "cursor-text border-b border-input"
                  )}
                >
                  {safeClientPhone}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">Client Address</label>
                <div
                  ref={clientAddressRef}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "outline-none min-h-[1.25rem] leading-5 font-semibold",
                    isEditing && "cursor-text border-b border-input"
                  )}
                >
                  {safeClientAddress}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {isEditing ? (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={handleSave}
                  aria-label="Save changes"
                >
                  <Check className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleCancel}
                  aria-label="Cancel changes"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    aria-label="More options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  {editable && !isLoading && (
                    <DropdownMenuItem onClick={handleEdit}>
                      Edit Claim
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={handleClaimDelete}
                    className="text-red-600 focus:text-red-600"
                    disabled={isLoading}
                  >
                    Delete Claim
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Claim Items</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewItem}
              className="gap-2"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>

          <ItemCardStack>
            {claim.items.map((item) => (
              <ItemCard
                key={item.id}
                title={item.title}
                description={item.description}
                editable={!isLoading}
                onSave={(data) => handleItemSave(item.id, data)}
                onDelete={() => handleItemDelete(item.id)}
              />
            ))}
          </ItemCardStack>
        </div>
      </CardContent>
    </Card>
  )
}