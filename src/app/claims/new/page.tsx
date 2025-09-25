'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function NewClaimPage() {
  const router = useRouter()

  useEffect(() => {
    const createNewClaim = async () => {
      try {
        const response = await fetch('/api/claims/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create new claim')
        }

        const newClaim = await response.json()

        // Redirect to the new claim's page
        router.replace(`/claims/${newClaim.id}?isNew=true`)
      } catch (error) {
        console.error('Error creating new claim:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to create new claim', {
          style: {
            background: '#ef4444',
            color: 'white',
            border: 'none'
          }
        })

        // Redirect back to claims page on error
        router.replace('/claims')
      }
    }

    createNewClaim()
  }, [router])

  // Show a loading state while creating the claim
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:gap-6 w-full items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Creating new claim...</p>
        </div>
      </div>
    </div>
  )
}