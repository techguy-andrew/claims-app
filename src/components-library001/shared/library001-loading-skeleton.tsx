'use client'

import React from 'react'

// ============================================================================
// LIBRARY001 LOADING SKELETON - Elegant Loading States with Shimmer Effect
// ============================================================================

interface Library001LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'item' | 'page' | 'section'
  lines?: number
  className?: string
  animate?: boolean
}

export function Library001LoadingSkeleton({ 
  variant = 'text',
  lines = 1,
  className = '',
  animate = true
}: Library001LoadingSkeletonProps) {
  
  // Base shimmer animation classes
  const shimmerClasses = animate 
    ? 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]' 
    : 'bg-gray-200'

  // Variant-specific rendering
  switch (variant) {
    case 'page':
      return (
        <div className="min-h-screen bg-gray-50">
          <main className="px-4 sm:px-6 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header Skeleton */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`h-7 w-32 rounded ${shimmerClasses}`} />
                    <div className={`h-6 w-20 rounded-lg ${shimmerClasses}`} />
                  </div>
                  <div className={`h-10 w-10 rounded-lg ${shimmerClasses}`} />
                </div>
                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className={`w-12 h-12 rounded-xl ${shimmerClasses}`} />
                      <div className="flex-1 space-y-2">
                        <div className={`h-3 w-20 rounded ${shimmerClasses}`} />
                        <div className={`h-4 w-full rounded ${shimmerClasses}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Section Skeleton */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`h-6 w-20 rounded mb-2 ${shimmerClasses}`} />
                    <div className={`h-4 w-32 rounded ${shimmerClasses}`} />
                  </div>
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-xl mr-4 ${shimmerClasses}`} />
                      <div className="flex-1">
                        <div className={`h-5 w-48 rounded ${shimmerClasses}`} />
                      </div>
                      <div className="flex gap-2">
                        <div className={`w-5 h-5 rounded ${shimmerClasses}`} />
                        <div className={`w-10 h-10 rounded-lg ${shimmerClasses}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      )

    case 'section':
      return (
        <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${shimmerClasses}`} />
              <div>
                <div className={`h-5 w-32 rounded mb-2 ${shimmerClasses}`} />
                <div className={`h-3 w-24 rounded ${shimmerClasses}`} />
              </div>
            </div>
            <div className={`h-10 w-10 rounded-lg ${shimmerClasses}`} />
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`h-4 w-full rounded ${shimmerClasses}`} />
            ))}
          </div>
        </div>
      )

    case 'card':
      return (
        <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-xl mr-4 ${shimmerClasses}`} />
            <div className="flex-1 space-y-2">
              <div className={`h-5 w-3/4 rounded ${shimmerClasses}`} />
              <div className={`h-3 w-1/2 rounded ${shimmerClasses}`} />
            </div>
            <div className={`w-10 h-10 rounded-lg ${shimmerClasses}`} />
          </div>
        </div>
      )

    case 'item':
      return (
        <div className={`flex items-center gap-4 p-4 ${className}`}>
          <div className={`w-12 h-12 rounded-xl ${shimmerClasses}`} />
          <div className="flex-1 space-y-2">
            <div className={`h-4 w-3/4 rounded ${shimmerClasses}`} />
            <div className={`h-3 w-1/2 rounded ${shimmerClasses}`} />
          </div>
        </div>
      )

    case 'text':
    default:
      return (
        <div className={`space-y-2 ${className}`}>
          {[...Array(lines)].map((_, i) => (
            <div 
              key={i} 
              className={`h-4 rounded ${shimmerClasses}`}
              style={{ width: `${Math.random() * 30 + 70}%` }}
            />
          ))}
        </div>
      )
  }
}

// ============================================================================
// LIBRARY001 CLAIM PAGE SKELETON - Specific Loading State for Claims
// ============================================================================

export function Library001ClaimPageSkeleton() {
  return <Library001LoadingSkeleton variant="page" />
}

// Default export
export default Library001LoadingSkeleton