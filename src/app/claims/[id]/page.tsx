"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Phone, 
  Mail,
  MapPin,
  Edit,
  Share2
} from 'lucide-react'
import { InfoCard } from '@/components/info-card'
import { TopBar, TopbarAction } from '@/components/navigation/topbar'
import { useSidebar } from '@/components/navigation'

interface ClaimData {
  id: string
  claimNumber: string
  status: 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'CLOSED'
  insuranceCompany: string
  adjustorName: string
  adjustorEmail: string
  clientName: string
  clientPhone: string
  clientAddress: string
  claimDate: string
  createdBy: {
    firstName: string | null
    lastName: string | null
    email: string
  }
  organization: {
    name: string
  }
}

const statusGradients = {
  OPEN: 'from-blue-400 to-blue-500',
  IN_PROGRESS: 'from-amber-400 to-orange-500',
  UNDER_REVIEW: 'from-purple-400 to-purple-500',
  APPROVED: 'from-green-400 to-emerald-500',
  DENIED: 'from-red-400 to-red-500',
  CLOSED: 'from-gray-400 to-gray-500'
}

const statusLabels = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN PROGRESS',
  UNDER_REVIEW: 'UNDER REVIEW',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  CLOSED: 'CLOSED'
}

export default function ClaimDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { toggle } = useSidebar()
  const [claim, setClaim] = useState<ClaimData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    params.then(({ id }) => {
      fetchClaim(id)
    })
  }, [params])

  const fetchClaim = async (id: string) => {
    try {
      const response = await fetch(`/api/claims/${id}`)
      const data = await response.json()
      
      if (response.ok) {
        setClaim(data)
      } else {
        console.error("Failed to fetch claim:", data.error)
      }
    } catch (error) {
      console.error("Error fetching claim:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Claim ${claim?.claimNumber}`,
        text: `Insurance claim details for ${claim?.clientName}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading || !claim) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 max-w-md mx-auto">
          <p className="text-gray-600">{loading ? "Loading premium claim..." : "Claim not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* CSS Animation */}
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
        title={claim?.claimNumber || "Claim Details"}
        showMenuButton={true}
        onMenuToggle={toggle}
        actions={
          <div className="flex items-center gap-2">
            <TopbarAction
              icon={ArrowLeft}
              label="Back to Claims"
              variant="secondary"
              onClick={() => router.push('/claims')}
            />
            <TopbarAction
              icon={Share2}
              label="Share"
              variant="ghost"
              onClick={handleShare}
            />
          </div>
        }
      />

      {/* Main content */}
      <main className="px-4 sm:px-6 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-10" style={{ animation: 'fadeIn 0.8s ease-out' }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{claim.claimNumber}</h1>
          <span className={`
            inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-white
            bg-gradient-to-r ${statusGradients[claim.status]} shadow-lg
          `}>
            {statusLabels[claim.status]}
          </span>
        </div>

        {/* Insurance Section */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-1">
            Insurance Information
          </h2>
          <div className="space-y-3">
            <InfoCard 
              icon={Building2}
              label="Company" 
              value={claim.insuranceCompany}
              delay={100}
              onCopy={handleCopy}
            />
            <InfoCard 
              icon={User}
              label="Adjustor" 
              value={claim.adjustorName}
              delay={200}
              onCopy={handleCopy}
            />
            <InfoCard 
              icon={Mail}
              label="Adjustor Email" 
              value={claim.adjustorEmail}
              delay={300}
              onCopy={handleCopy}
            />
          </div>
        </div>

        {/* Client Section */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-1">
            Client Information
          </h2>
          <div className="space-y-3">
            <InfoCard 
              icon={User}
              label="Name" 
              value={claim.clientName}
              delay={400}
              onCopy={handleCopy}
            />
            <InfoCard 
              icon={Phone}
              label="Phone" 
              value={claim.clientPhone}
              delay={500}
              onCopy={handleCopy}
            />
            <InfoCard 
              icon={MapPin}
              label="Address" 
              value={claim.clientAddress}
              delay={600}
              onCopy={handleCopy}
            />
          </div>
        </div>
      </main>

      {/* Floating action button with gradient */}
      <button 
        onClick={() => setEditing(!editing)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl px-6 py-4 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] flex items-center gap-2"
      >
        <Edit className="h-5 w-5" />
        <span className="font-medium">Edit Claim</span>
      </button>

    </div>
  )
}