import { ClaimCard, ClaimCardStack } from '@/components/custom/ClaimCard'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering - don't statically generate this page
export const dynamic = 'force-dynamic'

export default async function ClaimsPage() {
  // Fetch claims from database
  const claims = await prisma.claim.findMany({
    include: {
      claimant: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">Claims</h1>
        <p className="text-muted-foreground">
          Manage your claims here.
        </p>
      </div>

      <ClaimCardStack>
        {claims.map((claim) => (
          <ClaimCard
            key={claim.id}
            claimNumber={claim.title}
            clientName={claim.description || claim.claimant.name || 'Unknown Client'}
            status={(() => {
              switch (claim.status) {
                case 'PENDING': return 'pending'
                case 'UNDER_REVIEW': return 'in-progress'
                case 'APPROVED': return 'completed'
                case 'REJECTED': return 'cancelled'
                case 'CLOSED': return 'cancelled'
                default: return 'pending'
              }
            })()}
            href={`/claims/${claim.id}`}
          />
        ))}
      </ClaimCardStack>
    </div>
  )
}