import { ItemCard, ItemCardStack } from '@/components/custom/ItemCard'
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

  // Fetch claim data from database
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    include: {
      items: true,
      claimant: true,
    },
  })

  if (!claim) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">{claim.title}</h1>
        <p className="text-xl text-muted-foreground">
          {claim.description}
        </p>
      </div>

      <ItemCardStack>
        {claim.items.map((item) => (
          <ItemCard
            key={item.id}
            title={item.title}
            description={item.description}
            editable={true}
          />
        ))}
      </ItemCardStack>
    </div>
  )
}