'use client'

import { ItemCard } from '@/components/custom/ItemCard'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <ItemCard
            title="Welcome to Your App"
            description="This is a reusable ItemCard component built with shadcn/ui components as building blocks."
            editable={true}
            onSave={(_data) => {
              // Handle save action
            }}
            onEdit={() => {
              // Handle edit action
            }}
            onDuplicate={() => {
              // Handle duplicate action
            }}
            onDelete={() => {
              // Handle delete action
            }}
          />
        </div>
      </div>
    </main>
  )
}