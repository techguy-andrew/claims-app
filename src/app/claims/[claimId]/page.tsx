import { ItemCard, ItemCardStack } from '@/components/custom/ItemCard'

interface ClaimDetailsPageProps {
  params: Promise<{
    claimId: string
  }>
}

export default async function ClaimDetailsPage({ params }: ClaimDetailsPageProps) {
  const { claimId } = await params

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">{claimId}</h1>
        <p className="text-xl text-muted-foreground">
          Acme Restoration Co.
        </p>
      </div>

      <ItemCardStack>
        <ItemCard
          title="Water Damaged Carpet"
          description="Commercial carpet in main lobby - 500 sq ft"
          editable={true}
        />
      </ItemCardStack>
    </div>
  )
}