"use client"

import { useRouter } from "next/navigation"
import { TopBar, TopbarAction } from '@/components/navigation/topbar'
import { useSidebar } from '@/components/navigation'
import { ArrowLeft } from 'lucide-react'

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
    <div>
      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <TopBar
        title="New Claim"
        showMenuButton={true}
        onMenuToggle={handleMenuToggle}
        actions={
          <TopbarAction
            icon={ArrowLeft}
            label="Back to Claims"
            variant="secondary"
            onClick={handleBackClick}
          />
        }
      />
      <div className="p-4 sm:p-6 space-y-8">
        <div style={{ animation: 'slideUp 0.6s ease-out 100ms both' }}>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Claim Form</h2>
              <p className="text-sm text-gray-600">Create a new insurance claim with our streamlined process</p>
            </div>
            <div className="space-y-6">
              <p className="text-gray-600">Claim form functionality coming soon. Our premium interface will provide:</p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mt-0.5">
                    ✓
                  </div>
                  Step-by-step guided form with validation
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mt-0.5">
                    ✓
                  </div>
                  Document upload with preview
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mt-0.5">
                    ✓
                  </div>
                  Real-time status tracking
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mt-0.5">
                    ✓
                  </div>
                  Integration with insurance company systems
                </li>
              </ul>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleBackClick}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  View Existing Claims
                </button>
                <button 
                  onClick={handleCancelClick}
                  className="bg-white/60 backdrop-blur-xl text-gray-700 border border-gray-100/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 px-6 py-3 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}