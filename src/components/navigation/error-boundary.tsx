"use client";

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface NavigationErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface NavigationErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: Error;
    retry: () => void;
  }>;
}

/**
 * Error boundary specifically for navigation components
 * Prevents navigation errors from crashing the entire app
 */
export class NavigationErrorBoundary extends React.Component<
  NavigationErrorBoundaryProps,
  NavigationErrorBoundaryState
> {
  constructor(props: NavigationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): NavigationErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error('Navigation Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultNavigationErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

/**
 * Default fallback UI for navigation errors
 */
function DefaultNavigationErrorFallback({ 
  error, 
  retry 
}: { 
  error: Error; 
  retry: () => void; 
}) {
  return (
    <div className="fixed top-4 left-4 z-[var(--z-tooltip)] max-w-md">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Navigation Error
            </h3>
            <p className="text-xs text-red-700 mt-1">
              The navigation system encountered an error. You can try refreshing or continue using the app.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary className="text-xs text-red-600 cursor-pointer">
                  Error Details (Development)
                </summary>
                <pre className="text-xs text-red-600 mt-1 whitespace-pre-wrap">
                  {error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={retry}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-2 py-1 text-xs font-medium text-red-700 bg-transparent hover:bg-red-100 rounded transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Higher-order component for wrapping navigation components with error boundary
 */
export function withNavigationErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{
    error: Error;
    retry: () => void;
  }>
) {
  const WrappedComponent = (props: P) => (
    <NavigationErrorBoundary fallback={fallback}>
      <Component {...props} />
    </NavigationErrorBoundary>
  );

  WrappedComponent.displayName = `withNavigationErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}