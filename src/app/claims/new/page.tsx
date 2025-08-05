"use client"

import { useRouter } from "next/navigation"
import { 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui"
import { TopBar } from '@/components/navigation/topbar'
import { useSidebar } from '@/components/navigation'

export default function NewClaimPage() {
  const router = useRouter()
  const { toggle } = useSidebar()

  const handleBackClick = () => {
    console.log('Back button clicked')
    try {
      router.push('/claims')
      console.log('Router push called')
    } catch (error) {
      console.error('Router error:', error)
      // Emergency fallback
      window.location.href = '/claims'
    }
  }

  const handleCancelClick = () => {
    console.log('Cancel button clicked')
    try {
      router.push('/claims')
      console.log('Cancel router push called')
    } catch (error) {
      console.error('Cancel router error:', error)
      // Emergency fallback
      window.location.href = '/claims'
    }
  }

  const handleMenuToggle = () => {
    console.log('Menu toggle clicked')
    try {
      toggle()
      console.log('Toggle function called')
    } catch (error) {
      console.error('Toggle error:', error)
    }
  }

  return (
    <>
      <TopBar
        title="New Claim"
        subtitle="Create a new insurance claim"
        showMenuButton={true}
        onMenuToggle={handleMenuToggle}
        actions={
          <Button 
            variant="secondary"
            onClick={handleBackClick}
          >
            ← Back to Claims
          </Button>
        }
      />
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Debug Mode</CardTitle>
            <CardDescription>
              Testing navigation functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>This page is in debug mode to test navigation.</p>
            <div className="flex gap-4">
              <Button onClick={handleBackClick}>Test Back Button</Button>
              <Button onClick={handleCancelClick}>Test Cancel Button</Button>
              <Button onClick={() => window.location.href = '/claims'}>Emergency Redirect</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}