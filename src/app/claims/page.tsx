import { ClaimCard, ClaimCardStack } from '@/components/custom/ClaimCard'

export default function ClaimsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">Claims</h1>
        <p className="text-muted-foreground">
          Manage your claims here.
        </p>
      </div>

      <ClaimCardStack>
        <ClaimCard
          claimNumber="CLAIM-001"
          clientName="Acme Restoration Co."
          status="in-progress"
          href="/claims/CLAIM-001"
        />
      </ClaimCardStack>
    </div>
  )
}