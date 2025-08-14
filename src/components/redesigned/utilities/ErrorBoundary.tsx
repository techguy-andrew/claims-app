'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  MessageCircle, 
  Bug,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Button } from '../ui/Button'
import styles from './ErrorBoundary.module.css'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ErrorInfo {
  componentStack: string
  errorBoundary?: string
  errorBoundaryStack?: string
}

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  eventId?: string
}

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: ErrorInfo, eventId?: string) => void
  enableDevelopmentMode?: boolean
  showReportButton?: boolean
  reportErrorEndpoint?: string
  resetOnPropsChange?: boolean
  isolate?: boolean
  level?: 'page' | 'section' | 'component'
  className?: string
}

export interface ErrorFallbackProps {
  error: Error
  errorInfo?: ErrorInfo
  eventId?: string
  resetError: () => void
  level: 'page' | 'section' | 'component'
  onReport?: (error: Error, errorInfo?: ErrorInfo, eventId?: string) => void
  className?: string
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateEventId = (): string => {
  return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

const sanitizeErrorMessage = (message: string): string => {
  // Remove potentially sensitive information
  return message
    .replace(/\/[^\s]+/g, '[PATH]') // Remove file paths
    .replace(/\b\d{4,}\b/g, '[NUMBER]') // Remove long numbers
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]') // Remove emails
}

const getErrorSeverity = (error: Error): 'low' | 'medium' | 'high' | 'critical' => {
  const message = error.message.toLowerCase()
  
  if (message.includes('network') || message.includes('fetch')) return 'medium'
  if (message.includes('chunk') || message.includes('loading')) return 'low'
  if (message.includes('permission') || message.includes('unauthorized')) return 'high'
  if (message.includes('cannot read') || message.includes('undefined')) return 'critical'
  
  return 'medium'
}

// ============================================================================
// DEFAULT ERROR FALLBACK COMPONENT
// ============================================================================

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  eventId,
  resetError,
  level,
  onReport,
  className
}) => {
  const [showDetails, setShowDetails] = React.useState(false)
  const [isReporting, setIsReporting] = React.useState(false)
  const [reportSent, setReportSent] = React.useState(false)

  const severity = getErrorSeverity(error)
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  const handleReport = async () => {
    if (onReport && !reportSent) {
      setIsReporting(true)
      try {
        await onReport(error, errorInfo, eventId)
        setReportSent(true)
      } catch (reportError) {
        console.error('Failed to report error:', reportError)
      } finally {
        setIsReporting(false)
      }
    }
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  // Animation variants based on level
  const containerVariants = {
    hidden: { opacity: 0, y: level === 'page' ? 50 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: level === 'page' ? -50 : -20,
      transition: { duration: 0.3 }
    }
  }

  const getErrorIcon = () => {
    switch (severity) {
      case 'critical': return AlertTriangle
      case 'high': return Bug
      default: return AlertTriangle
    }
  }

  const ErrorIcon = getErrorIcon()

  return (
    <motion.div
      className={`${styles.errorBoundary} ${styles[level]} ${styles[severity]} ${className || ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={styles.errorContainer}>
        {/* Error Icon */}
        <div className={styles.errorIcon}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <ErrorIcon className={styles.errorIconSvg} />
          </motion.div>
        </div>

        {/* Error Content */}
        <div className={styles.errorContent}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className={styles.errorTitle}>
              {level === 'page' 
                ? 'Something went wrong'
                : level === 'section'
                ? 'Section unavailable'
                : 'Component error'
              }
            </h2>
            
            <p className={styles.errorMessage}>
              {sanitizeErrorMessage(error.message) || 'An unexpected error occurred'}
            </p>

            {eventId && (
              <p className={styles.errorId}>
                Error ID: <code>{eventId}</code>
              </p>
            )}
          </motion.div>

          {/* Error Actions */}
          <motion.div
            className={styles.errorActions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="primary"
              onClick={resetError}
              leftIcon={<RefreshCw />}
              className={styles.primaryAction}
            >
              Try Again
            </Button>

            {level === 'page' && (
              <Button
                variant="ghost"
                onClick={handleGoHome}
                leftIcon={<Home />}
              >
                Go Home
              </Button>
            )}

            {level === 'page' && (
              <Button
                variant="ghost"
                onClick={handleRefresh}
                leftIcon={<RefreshCw />}
              >
                Refresh Page
              </Button>
            )}

            {onReport && (
              <Button
                variant="outline"
                onClick={handleReport}
                loading={isReporting}
                disabled={reportSent}
                leftIcon={reportSent ? <MessageCircle /> : <Bug />}
              >
                {reportSent ? 'Report Sent' : 'Report Issue'}
              </Button>
            )}
          </motion.div>

          {/* Error Details (Development) */}
          {isDevelopment && (
            <motion.div
              className={styles.errorDetails}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                className={styles.detailsToggle}
                onClick={() => setShowDetails(!showDetails)}
              >
                <span>Error Details (Development)</span>
                {showDetails ? (
                  <ChevronUp className={styles.detailsIcon} />
                ) : (
                  <ChevronDown className={styles.detailsIcon} />
                )}
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    className={styles.detailsContent}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.errorStack}>
                      <h4>Error Stack:</h4>
                      <pre>{error.stack}</pre>
                    </div>
                    
                    {errorInfo?.componentStack && (
                      <div className={styles.componentStack}>
                        <h4>Component Stack:</h4>
                        <pre>{errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Help Links */}
          {level === 'page' && (
            <motion.div
              className={styles.helpLinks}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <a
                href="/help"
                className={styles.helpLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className={styles.helpIcon} />
                Get Help
              </a>
              <a
                href="/contact"
                className={styles.helpLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className={styles.helpIcon} />
                Contact Support
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// ERROR BOUNDARY CLASS COMPONENT
// ============================================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const eventId = generateEventId()
    return { 
      hasError: true, 
      error,
      eventId
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, enableDevelopmentMode } = this.props
    const eventId = this.state.eventId

    // Log error in development
    if (enableDevelopmentMode || process.env.NODE_ENV === 'development') {
      console.group('🚨 ErrorBoundary caught an error')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Event ID:', eventId)
      console.groupEnd()
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo,
      eventId
    })

    // Call onError callback if provided
    if (onError) {
      try {
        onError(error, errorInfo, eventId)
      } catch (callbackError) {
        console.error('Error in onError callback:', callbackError)
      }
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange } = this.props
    const { hasError } = this.state

    // Reset error state if props changed and resetOnPropsChange is enabled
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetError()
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  resetError = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      eventId: undefined
    })
  }

  handleReport = async (error: Error, errorInfo?: ErrorInfo, eventId?: string) => {
    const { reportErrorEndpoint } = this.props
    
    if (!reportErrorEndpoint) return

    try {
      await fetch(reportErrorEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: {
            message: sanitizeErrorMessage(error.message),
            stack: error.stack,
            name: error.name
          },
          errorInfo,
          eventId,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      })
    } catch (reportError) {
      console.error('Failed to report error:', reportError)
      throw reportError
    }
  }

  render() {
    const { hasError, error, errorInfo, eventId } = this.state
    const { 
      children, 
      fallback: FallbackComponent, 
      isolate, 
      level = 'component',
      className,
      showReportButton
    } = this.props

    if (hasError && error) {
      const Fallback = FallbackComponent || DefaultErrorFallback
      
      const fallbackProps: ErrorFallbackProps = {
        error,
        errorInfo,
        eventId,
        resetError: this.resetError,
        level,
        onReport: showReportButton ? this.handleReport : undefined,
        className
      }

      if (isolate) {
        return (
          <div className={styles.isolatedError}>
            <Fallback {...fallbackProps} />
          </div>
        )
      }

      return <Fallback {...fallbackProps} />
    }

    return children
  }
}

// ============================================================================
// HIGHER-ORDER COMPONENT
// ============================================================================

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ))

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

// ============================================================================
// HOOK FOR ERROR REPORTING
// ============================================================================

export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: Partial<ErrorInfo>) => {
    // Create a synthetic error boundary error
    const syntheticError = new Error(error.message)
    syntheticError.stack = error.stack
    syntheticError.name = error.name

    // Throw the error to be caught by the nearest error boundary
    throw syntheticError
  }, [])
}

export default ErrorBoundary