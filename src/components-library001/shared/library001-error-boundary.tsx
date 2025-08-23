'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Library001Button } from '../ui/library001-button'
import { Library001Card } from '../ui/library001-card'

// ============================================================================
// TYPES
// ============================================================================

interface Library001ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface Library001ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export class Library001ErrorBoundary extends Component<
  Library001ErrorBoundaryProps,
  Library001ErrorBoundaryState
> {
  constructor(props: Library001ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<Library001ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      errorInfo
    })

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Library001Card variant="enterprise" padding="lg" className="max-w-md w-full">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900">
                Something went wrong
              </h2>
              
              <p className="text-sm text-gray-600 max-w-sm">
                An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
              </p>

              {/* Error details in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="w-full text-left">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                    Error details
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-50 p-3 rounded-lg overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex gap-3 w-full pt-4">
                <Library001Button
                  onClick={this.handleReset}
                  variant="secondary"
                  fullWidth
                >
                  Try Again
                </Library001Button>
                
                <Library001Button
                  onClick={() => window.location.reload()}
                  variant="primary"
                  fullWidth
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Library001Button>
              </div>
            </div>
          </Library001Card>
        </div>
      )
    }

    return this.props.children
  }
}

// ============================================================================
// HOOK FOR FUNCTIONAL COMPONENTS
// ============================================================================

export function useLibrary001ErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  const resetError = () => setError(null)
  const throwError = (error: Error) => setError(error)

  return { throwError, resetError }
}

export default Library001ErrorBoundary