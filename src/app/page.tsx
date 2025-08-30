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
            onSave={(data) => {
              console.log('Saving:', data)
            }}
            onEdit={() => {
              console.log('Edit clicked')
            }}
            onDuplicate={() => {
              console.log('Duplicate clicked')
            }}
            onDelete={() => {
              console.log('Delete clicked')
            }}
          />
        </div>
      </div>
    </main>
  )
}