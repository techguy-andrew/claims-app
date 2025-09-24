'use client'

import { ItemCard } from '@/components/custom/ItemCard'

export default function ClaimsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">Claims</h1>
        <p className="text-muted-foreground">
          Manage your claims here.
        </p>
      </div>

      <div className="max-w-md">
        <ItemCard
          title="Sample Claim"
          description="This is a sample claim item"
          editable={true}
          onSave={(data) => console.log('Saved:', data)}
          onEdit={() => console.log('Edit clicked')}
          onDelete={() => console.log('Delete clicked')}
          onDuplicate={() => console.log('Duplicate clicked')}
        />
      </div>
    </div>
  )
}