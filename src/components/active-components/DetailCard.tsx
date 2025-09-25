'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
} from './card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Button } from './button'
import { ItemCard, ItemCardStack } from './ItemCard'
import { MoreVertical, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
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
  isNewClaim?: boolean
}

export function DetailCard({
  claim: initialClaim,
  className,
  editable = false,
  isNewClaim = false,
  ...props
}: DetailCardProps) {
  const [claim, setClaim] = React.useState<ClaimData>(initialClaim)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    setClaim(initialClaim)
  }, [initialClaim])

  // Safe defaults for the fields
  const safeClaimNumber = claim.claimNumber || ''
  const safeInsuranceCompany = claim.insuranceCompany || ''
  const safeAdjustor = claim.adjustor || ''
  const safeClientName = claim.claimant.name || ''
  const safeClientPhone = claim.clientPhone || ''
  const safeClientAddress = claim.clientAddress || ''

  // Editing state following ItemCard pattern
  const [isEditing, setIsEditing] = React.useState(isNewClaim)
  const [tempClaimNumber, setTempClaimNumber] = React.useState(safeClaimNumber)
  const [tempInsuranceCompany, setTempInsuranceCompany] = React.useState(safeInsuranceCompany)
  const [tempAdjustor, setTempAdjustor] = React.useState(safeAdjustor)
  const [tempClientName, setTempClientName] = React.useState(safeClientName)
  const [tempClientPhone, setTempClientPhone] = React.useState(safeClientPhone)
  const [tempClientAddress, setTempClientAddress] = React.useState(safeClientAddress)
  const [originalClaimNumber, setOriginalClaimNumber] = React.useState(safeClaimNumber)
  const [originalInsuranceCompany, setOriginalInsuranceCompany] = React.useState(safeInsuranceCompany)
  const [originalAdjustor, setOriginalAdjustor] = React.useState(safeAdjustor)
  const [originalClientName, setOriginalClientName] = React.useState(safeClientName)
  const [originalClientPhone, setOriginalClientPhone] = React.useState(safeClientPhone)
  const [originalClientAddress, setOriginalClientAddress] = React.useState(safeClientAddress)

  const claimNumberRef = React.useRef<HTMLDivElement>(null)
  const insuranceCompanyRef = React.useRef<HTMLDivElement>(null)
  const adjustorRef = React.useRef<HTMLDivElement>(null)
  const clientNameRef = React.useRef<HTMLDivElement>(null)
  const clientPhoneRef = React.useRef<HTMLDivElement>(null)
  const clientAddressRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setTempClaimNumber(safeClaimNumber)
    setTempInsuranceCompany(safeInsuranceCompany)
    setTempAdjustor(safeAdjustor)
    setTempClientName(safeClientName)
    setTempClientPhone(safeClientPhone)
    setTempClientAddress(safeClientAddress)
    setOriginalClaimNumber(safeClaimNumber)
    setOriginalInsuranceCompany(safeInsuranceCompany)
    setOriginalAdjustor(safeAdjustor)
    setOriginalClientName(safeClientName)
    setOriginalClientPhone(safeClientPhone)
    setOriginalClientAddress(safeClientAddress)
  }, [safeClaimNumber, safeInsuranceCompany, safeAdjustor, safeClientName, safeClientPhone, safeClientAddress])


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
      toast.error(error instanceof Error ? error.message : 'Failed to update client name', {
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none'
        }
      })
    }
  }

  // Handle claim save
  const handleClaimSave = async (data: {
    claimNumber: string
    insuranceCompany: string
    adjustor: string
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

      toast.success('Claim updated successfully', {
        style: {
          background: '#22c55e',
          color: 'white',
          border: 'none'
        }
      })
    } catch (error) {
      console.error('Error updating claim:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update claim', {
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none'
        }
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

      toast.success('Claim deleted successfully', {
        style: {
          background: '#22c55e',
          color: 'white',
          border: 'none'
        }
      })

      router.push('/claims')
    } catch (error) {
      console.error('Error deleting claim:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete claim', {
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none'
        }
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

      toast.success('Item updated successfully', {
        style: {
          background: '#22c55e',
          color: 'white',
          border: 'none'
        }
      })
    } catch (error) {
      console.error('Error updating item:', error)

      let errorMessage = 'Failed to update item'
      if (error instanceof TypeError && error.message === 'Load failed') {
        errorMessage = 'Network connection lost. Please check your connection and try again.'
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast.error(errorMessage, {
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none'
        }
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

      toast.success('Item deleted successfully', {
        style: {
          background: '#22c55e',
          color: 'white',
          border: 'none'
        }
      })
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete item', {
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none'
        }
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

      toast.success('Item created successfully', {
        style: {
          background: '#22c55e',
          color: 'white',
          border: 'none'
        }
      })
    } catch (error) {
      console.error('Error creating item:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create item', {
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none'
        }
      })
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setOriginalClaimNumber(claimNumberRef.current?.textContent || safeClaimNumber)
    setOriginalInsuranceCompany(insuranceCompanyRef.current?.textContent || safeInsuranceCompany)
    setOriginalAdjustor(adjustorRef.current?.textContent || safeAdjustor)
    setOriginalClientName(clientNameRef.current?.textContent || safeClientName)
    setOriginalClientPhone(clientPhoneRef.current?.textContent || safeClientPhone)
    setOriginalClientAddress(clientAddressRef.current?.textContent || safeClientAddress)
  }

  const handleSave = () => {
    if (claimNumberRef.current && insuranceCompanyRef.current && adjustorRef.current && clientNameRef.current && clientPhoneRef.current && clientAddressRef.current) {
      const newClaimNumber = claimNumberRef.current.textContent || ''
      const newInsuranceCompany = insuranceCompanyRef.current.textContent || ''
      const newAdjustor = adjustorRef.current.textContent || ''
      const newClientName = clientNameRef.current.textContent || ''
      const newClientPhone = clientPhoneRef.current.textContent || ''
      const newClientAddress = clientAddressRef.current.textContent || ''

      handleClaimSave({
        claimNumber: newClaimNumber,
        insuranceCompany: newInsuranceCompany,
        adjustor: newAdjustor,
        clientPhone: newClientPhone,
        clientAddress: newClientAddress
      })

      // Update client name separately
      handleClientNameUpdate(newClientName)

      setTempClaimNumber(newClaimNumber)
      setTempInsuranceCompany(newInsuranceCompany)
      setTempAdjustor(newAdjustor)
      setTempClientName(newClientName)
      setTempClientPhone(newClientPhone)
      setTempClientAddress(newClientAddress)
    }
    setIsEditing(false)
  }


  const checkForChanges = () => {
    const currentClaimNumber = claimNumberRef.current?.textContent || ''
    const currentInsuranceCompany = insuranceCompanyRef.current?.textContent || ''
    const currentAdjustor = adjustorRef.current?.textContent || ''
    const currentClientName = clientNameRef.current?.textContent || ''
    const currentClientPhone = clientPhoneRef.current?.textContent || ''
    const currentClientAddress = clientAddressRef.current?.textContent || ''

    return currentClaimNumber !== originalClaimNumber ||
           currentInsuranceCompany !== originalInsuranceCompany ||
           currentAdjustor !== originalAdjustor ||
           currentClientName !== originalClientName ||
           currentClientPhone !== originalClientPhone ||
           currentClientAddress !== originalClientAddress
  }

  const handleCancel = () => {
    if (checkForChanges()) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to cancel? Your changes will be lost.')) {
        return
      }
    }

    if (claimNumberRef.current && insuranceCompanyRef.current && adjustorRef.current && clientNameRef.current && clientPhoneRef.current && clientAddressRef.current) {
      claimNumberRef.current.textContent = tempClaimNumber
      insuranceCompanyRef.current.textContent = tempInsuranceCompany
      adjustorRef.current.textContent = tempAdjustor
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
    <Card className={cn('w-full h-full', className)} {...props}>
      <CardHeader className="p-4 sm:p-6">
        <div className="grid grid-cols-[1fr,auto] gap-4 sm:gap-6 items-start w-full">
          <div
            className="flex flex-col gap-3 min-w-0 flex-1"
            onDoubleClick={() => editable && !isLoading && !isEditing && handleEdit()}
          >
            <div className="flex flex-col gap-3 sm:gap-4 w-full">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Claim Number</label>
                <div
                  ref={claimNumberRef}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "outline-none min-h-[1.75rem] leading-7 font-semibold text-sm sm:text-base break-words w-full",
                    "border-none bg-transparent p-0 m-0 resize-none",
                    "focus:outline-none focus:ring-0 focus:border-transparent",
                    isEditing && "cursor-text"
                  )}
                >
                  {safeClaimNumber}
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Insurance Company</label>
                <div
                  ref={insuranceCompanyRef}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "outline-none min-h-[1.25rem] leading-5 font-semibold text-sm sm:text-base break-words w-full",
                    "border-none bg-transparent p-0 m-0 resize-none",
                    "focus:outline-none focus:ring-0 focus:border-transparent",
                    isEditing && "cursor-text"
                  )}
                >
                  {safeInsuranceCompany}
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Adjustor</label>
                <div
                  ref={adjustorRef}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "outline-none min-h-[1.25rem] leading-5 font-semibold text-sm sm:text-base break-words w-full",
                    "border-none bg-transparent p-0 m-0 resize-none",
                    "focus:outline-none focus:ring-0 focus:border-transparent",
                    isEditing && "cursor-text"
                  )}
                >
                  {safeAdjustor}
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Client Name</label>
                <div
                  ref={clientNameRef}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "outline-none min-h-[1.25rem] leading-5 font-semibold text-sm sm:text-base break-words w-full",
                    "border-none bg-transparent p-0 m-0 resize-none",
                    "focus:outline-none focus:ring-0 focus:border-transparent",
                    isEditing && "cursor-text"
                  )}
                >
                  {safeClientName}
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Client Phone</label>
                <div
                  ref={clientPhoneRef}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "outline-none min-h-[1.25rem] leading-5 font-semibold text-sm sm:text-base break-words w-full",
                    "border-none bg-transparent p-0 m-0 resize-none",
                    "focus:outline-none focus:ring-0 focus:border-transparent",
                    isEditing && "cursor-text"
                  )}
                >
                  {safeClientPhone}
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Client Address</label>
                <div
                  ref={clientAddressRef}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "outline-none min-h-[1.25rem] leading-5 font-semibold text-sm sm:text-base break-words w-full",
                    "border-none bg-transparent p-0 m-0 resize-none",
                    "focus:outline-none focus:ring-0 focus:border-transparent",
                    isEditing && "cursor-text"
                  )}
                >
                  {safeClientAddress}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full px-3 py-1 h-8 text-xs font-medium text-green-600 border-green-200 hover:text-green-700 hover:bg-green-50 hover:border-green-300"
                  onClick={handleSave}
                  aria-label="Save changes"
                >
                  Save
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full px-3 py-1 h-8 text-xs font-medium text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                  onClick={handleCancel}
                  aria-label="Cancel changes"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 sm:h-8 sm:w-8"
                    aria-label="More options"
                  >
                    <MoreVertical className="h-5 w-5 sm:h-4 sm:w-4" />
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

      <CardContent className="p-4 sm:p-6 pt-0 w-full">
        <div className="flex flex-col gap-4 sm:gap-6 w-full">
          <div className="flex items-center justify-between w-full">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">Claim Items</label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewItem}
              className="gap-2 h-9 sm:h-8 px-3 text-xs sm:text-sm"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>

          <ItemCardStack className="w-full">
            {claim.items.map((item) => (
              <ItemCard
                key={item.id}
                title={item.title}
                description={item.description}
                editable={!isLoading}
                onSave={(data) => handleItemSave(item.id, data)}
                onDelete={() => handleItemDelete(item.id)}
                className="w-full h-full"
              />
            ))}
          </ItemCardStack>
        </div>
      </CardContent>
    </Card>
  )
}