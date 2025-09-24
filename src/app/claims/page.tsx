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

      <ItemCard
        title="Sample Claim"
        description="This is a sample claim item"
        editable={true}
        onSave={(_data) => {
          // Handle save operation
        }}
        onEdit={() => {
          // Handle edit operation
        }}
        onDelete={() => {
          // Handle delete operation
        }}
        onDuplicate={() => {
          // Handle duplicate operation
        }}
      />
    </div>
  )
}