import { DetailCard } from '@/components/custom/DetailCard'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

// Force dynamic rendering - don't statically generate this page
export const dynamic = 'force-dynamic'

interface ClaimDetailsPageProps {
  params: Promise<{
    claimId: string
  }>
}

export default async function ClaimDetailsPage({ params }: ClaimDetailsPageProps) {
  const { claimId } = await params

  // Fetch claim data from database with all needed relations
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    include: {
      items: {
        orderBy: { createdAt: 'asc' }
      },
      claimant: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
  })

  if (!claim) {
    notFound()
  }

  // Convert Prisma Decimal to number for client component
  const serializedClaim = {
    ...claim,
    amount: claim.amount ? Number(claim.amount) : null,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <DetailCard claim={serializedClaim} editable={true} />
      </div>
    </div>
  )
}