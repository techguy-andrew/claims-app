// ============================================================================
// CLAIMS COMPONENTS EXPORT - Complete redevelopment with React Hook Form + Zod
// Modern claims management with glass morphism and Framer Motion
// ============================================================================

// Claim components - completely redesigned
export { ClaimCard } from './ClaimCard'
export { ClaimForm } from './ClaimForm'
export { ClaimItemsSection } from './ClaimItemsSection'

// Type exports
export type { 
  Claim,
  ClaimStatus,
  ClaimCardProps,
  ClaimCardAction
} from './ClaimCard'

export type {
  ClaimFormData,
  ClaimFormProps
} from './ClaimForm'

export type {
  ClaimItemsSectionProps
} from './ClaimItemsSection'

// Re-export schemas for server-side validation
export { claimFormSchema } from './ClaimForm'

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
## ClaimCard Usage

```tsx
import { ClaimCard, Claim } from '@/components/redesigned/claims'

const claim: Claim = {
  id: '1',
  claimNumber: 'CLM-2024-001',
  clientName: 'John Doe',
  insuranceCompany: 'State Farm',
  status: 'IN_PROGRESS',
  amount: 15000,
  dateCreated: '2024-01-15',
  dateUpdated: '2024-01-20',
  itemsCount: 3,
  filesCount: 12,
  priority: 'HIGH'
}

<ClaimCard
  claim={claim}
  onClick={(claim) => router.push(`/claims/${claim.id}`)}
  actions={[
    {
      id: 'edit',
      label: 'Edit Claim',
      icon: Edit,
      onClick: (claim) => handleEdit(claim)
    }
  ]}
/>
```

## ClaimForm Usage

```tsx
import { ClaimForm, ClaimFormData, claimFormSchema } from '@/components/redesigned/claims'

function CreateClaimPage() {
  const handleSubmit = async (data: ClaimFormData) => {
    const validatedData = claimFormSchema.parse(data)
    await createClaim(validatedData)
  }

  return (
    <ClaimForm
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      loading={isSubmitting}
    />
  )
}
```

## ClaimItemsSection Usage

```tsx
import { ClaimItemsSection, ClaimItem } from '@/components/redesigned/claims'

function ClaimDetailsPage({ claimId }: { claimId: string }) {
  const [items, setItems] = useState<ClaimItem[]>([])

  return (
    <ClaimItemsSection
      claimId={claimId}
      items={items}
      onItemsChange={setItems}
      onFileAction={(action, file) => {
        if (action === 'view') handleViewFile(file)
        if (action === 'download') handleDownloadFile(file)
      }}
    />
  )
}
```

## Advanced Features

- **Glass morphism design** with backdrop-blur effects
- **Framer Motion animations** for smooth interactions
- **Advanced status system** with priority indicators
- **FloatingContextMenu** for action management
- **Mobile-first responsive** with 44px touch targets
- **Accessibility-optimized** with proper ARIA attributes
- **TypeScript 5 strict typing** with discriminated unions

## Architecture Compliance

- **React 18.3.1** functional components
- **CSS Modules** for component-scoped styling
- **Framer Motion** for production-grade animations
- **Advanced TypeScript interfaces** for type safety
- **SSR-safe hooks** for Next.js 15.2.3 compatibility
*/