'use client'

import React, { useState, useCallback, useRef } from 'react'
import { 
  Building2, 
  User, 
  Phone, 
  Mail,
  MapPin,
  Edit,
  Copy,
  Check,
  Printer
} from 'lucide-react'
import { Library001InvisibleInput } from '../shared/library001-invisible-input'
import { Library001FloatingContextMenu, type Library001MenuAction } from '../shared/library001-floating-context-menu'
import { Library001SaveCancelButtons } from '../shared/library001-save-cancel-buttons'

// ============================================================================
// TYPES
// ============================================================================

export interface Library001ClaimData {
  id: string
  claimNumber: string
  status: 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'CLOSED'
  insuranceCompany: string
  adjustorName: string
  adjustorEmail: string
  clientName: string
  clientPhone: string
  clientAddress: string
  claimDate: string
  createdBy: {
    firstName: string | null
    lastName: string | null
    email: string
  }
  organization: {
    name: string
  }
}

export interface Library001ClaimFieldValues {
  insuranceCompany: string
  adjustorName: string
  adjustorEmail: string
  clientName: string
  clientPhone: string
  clientAddress: string
}

export interface Library001ClaimFieldErrors {
  insuranceCompany?: string | null
  adjustorName?: string | null
  adjustorEmail?: string | null
  clientName?: string | null
  clientPhone?: string | null
  clientAddress?: string | null
  general?: string | null
}

interface Library001ClaimInformationProps {
  claim: Library001ClaimData
  isEditing: boolean
  fieldValues: Library001ClaimFieldValues
  fieldErrors: Library001ClaimFieldErrors
  isSaving: boolean
  onEditMode: () => void
  onSave: () => void
  onCancel: () => void
  onFieldChange: (field: string, value: string) => void
}

// ============================================================================
// FLOATING TOAST COMPONENT
// ============================================================================

const Library001Toast: React.FC<{ message: string; visible: boolean }> = ({ message, visible }) => (
  <div
    className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 z-50 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
    }`}
  >
    <div className="flex items-center space-x-2">
      <Check className="h-4 w-4" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  </div>
)

// ============================================================================
// MAIN COMPONENT - Library001 Claim Information with Inline Editing
// ============================================================================

export function Library001ClaimInformation({
  claim,
  isEditing,
  fieldValues,
  fieldErrors,
  isSaving,
  onEditMode,
  onSave,
  onCancel,
  onFieldChange
}: Library001ClaimInformationProps) {
  const [showToast, setShowToast] = useState(false)
  
  // Store scroll position to prevent jumping during edit mode transitions
  const scrollPosRef = useRef(0)

  const handleEditMode = useCallback(() => {
    // Store scroll position before any state changes to prevent screen jumping
    scrollPosRef.current = window.scrollY
    onEditMode()
  }, [onEditMode])

  const handleSave = useCallback(async () => {
    await onSave()
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
    
    // Restore scroll position after successful save
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosRef.current)
    })
  }, [onSave])

  const handleCancel = useCallback(() => {
    onCancel()
    
    // Restore scroll position to prevent screen jumping
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosRef.current)
    })
  }, [onCancel])

  // Create claim menu actions
  const claimMenuActions: Library001MenuAction[] = [
    {
      id: 'edit',
      label: 'Edit Claim Details',
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEditMode
    },
    {
      id: 'copy',
      label: 'Copy Claim Info',
      icon: <Copy className="h-4 w-4" />,
      onClick: () => {
        const claimInfo = `Claim: ${claim.claimNumber}\nInsurance: ${claim.insuranceCompany}\nAdjustor: ${claim.adjustorName}\nClient: ${claim.clientName}`
        navigator.clipboard.writeText(claimInfo)
      }
    },
    {
      id: 'print',
      label: 'Print Details',
      icon: <Printer className="h-4 w-4" />,
      onClick: () => window.print()
    }
  ]

  return (
    <>
      {/* General Error Display */}
      {fieldErrors.general && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{fieldErrors.general}</p>
        </div>
      )}

      {/* Information Sections - Flat Design with Context Menu */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Header with Context Menu */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">{claim.claimNumber}</h2>
            <div className={`
              inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium
              ${claim.status === 'OPEN' ? 'bg-blue-50 text-blue-700' :
                claim.status === 'IN_PROGRESS' ? 'bg-yellow-50 text-yellow-700' :
                claim.status === 'UNDER_REVIEW' ? 'bg-purple-50 text-purple-700' :
                claim.status === 'APPROVED' ? 'bg-green-50 text-green-700' :
                claim.status === 'DENIED' ? 'bg-red-50 text-red-700' :
                'bg-gray-50 text-gray-700'}
            `}>
              {claim.status.replace('_', ' ')}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <Library001FloatingContextMenu actions={claimMenuActions} />
            ) : (
              <Library001SaveCancelButtons
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={isSaving}
              />
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Insurance Section */}
          <div className="space-y-6">
            <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wider">
              Insurance Information
            </h3>
            
            {/* Insurance Company */}
            <div className="group">
              <div className="flex items-center gap-3 p-3 rounded-lg">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Building2 className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Company</p>
                  <Library001InvisibleInput
                    value={fieldValues.insuranceCompany || ''}
                    onChange={(v) => onFieldChange('insuranceCompany', v)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isEditing={isEditing}
                    className="text-sm text-gray-900 font-medium"
                    placeholder="Insurance company"
                  />
                  {fieldErrors.insuranceCompany && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.insuranceCompany}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Adjustor Name */}
            <div className="group">
              <div className="flex items-center gap-3 p-3 rounded-lg">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Adjustor</p>
                  <Library001InvisibleInput
                    value={fieldValues.adjustorName || ''}
                    onChange={(v) => onFieldChange('adjustorName', v)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isEditing={isEditing}
                    className="text-sm text-gray-900 font-medium"
                    placeholder="Adjustor name"
                  />
                  {fieldErrors.adjustorName && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.adjustorName}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Adjustor Email */}
            <div className="group">
              <div className="flex items-center gap-3 p-3 rounded-lg">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Adjustor Email</p>
                  <Library001InvisibleInput
                    value={fieldValues.adjustorEmail || ''}
                    onChange={(v) => onFieldChange('adjustorEmail', v)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isEditing={isEditing}
                    className="text-sm text-gray-900 font-medium"
                    placeholder="adjustor@email.com"
                  />
                  {fieldErrors.adjustorEmail && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.adjustorEmail}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Client Section */}
          <div className="space-y-6">
            <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wider">
              Client Information
            </h3>
            
            {/* Client Name */}
            <div className="group">
              <div className="flex items-center gap-3 p-3 rounded-lg">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Name</p>
                  <Library001InvisibleInput
                    value={fieldValues.clientName || ''}
                    onChange={(v) => onFieldChange('clientName', v)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isEditing={isEditing}
                    className="text-sm text-gray-900 font-medium"
                    placeholder="Client name"
                  />
                  {fieldErrors.clientName && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.clientName}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Client Phone */}
            <div className="group">
              <div className="flex items-center gap-3 p-3 rounded-lg">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Phone</p>
                  <Library001InvisibleInput
                    value={fieldValues.clientPhone || ''}
                    onChange={(v) => onFieldChange('clientPhone', v)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isEditing={isEditing}
                    className="text-sm text-gray-900 font-medium"
                    placeholder="Phone number"
                  />
                  {fieldErrors.clientPhone && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.clientPhone}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Client Address */}
            <div className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Address</p>
                  <Library001InvisibleInput
                    value={fieldValues.clientAddress || ''}
                    onChange={(v) => onFieldChange('clientAddress', v)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isEditing={isEditing}
                    className="text-sm text-gray-900 font-medium"
                    placeholder="Client address"
                    multiline
                  />
                  {fieldErrors.clientAddress && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.clientAddress}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Library001Toast message="Claim details updated successfully" visible={showToast} />
    </>
  )
}

// Default export for convenience
export default Library001ClaimInformation