'use client';

import * as Sentry from '@sentry/nextjs';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in the child
 * component tree, logs them to Sentry, and displays a fallback UI.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to Sentry
    Sentry.withScope((scope) => {
      scope.setExtra('componentStack', errorInfo.componentStack);
      Sentry.captureException(error);
    });

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 text-6xl">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Something went wrong
          </h2>
          <p className="mb-4 text-gray-600">
            We&apos;ve been notified and are working to fix the issue.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
