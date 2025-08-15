/**
 * @fileoverview ErrorBoundary Component
 * 
 * A React error boundary component that catches JavaScript errors anywhere in the
 * child component tree and displays a fallback UI instead of the component tree
 * that crashed. This component also logs errors to the centralized error handling
 * system for monitoring and debugging purposes.
 * 
 * @author Restaurant Management System
 * @version 1.0.0
 */

"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { errorHandler } from "@/lib/error-handling"

/**
 * Props interface for the ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** The child components to be wrapped by the error boundary */
  children: ReactNode
  /** Optional custom fallback component to render when an error occurs */
  fallback?: ReactNode
  /** Optional callback function called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

/**
 * State interface for the ErrorBoundary component
 */
interface ErrorBoundaryState {
  /** Boolean indicating if an error has occurred */
  hasError: boolean
  /** The error object that was caught */
  error: Error | null
  /** Additional error information */
  errorInfo: ErrorInfo | null
}

/**
 * ErrorBoundary Component
 * 
 * A class component that implements React's error boundary pattern to catch
 * JavaScript errors in child components and prevent the entire application
 * from crashing. When an error occurs, it displays a user-friendly error
 * message and provides options to recover or report the issue.
 * 
 * Features:
 * - Catches JavaScript errors in child components
 * - Displays a user-friendly error UI
 * - Logs errors to the centralized error handling system
 * - Provides recovery options (retry, go home)
 * - Supports custom fallback components
 * - Maintains error state for debugging
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * // With custom fallback
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * // With error callback
 * <ErrorBoundary onError={(error, info) => console.log(error, info)}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  /**
   * Static method called when an error is thrown in a child component
   * 
   * This method is called during the "render" phase, so side-effects are not
   * allowed. It should only be used to update the state to render a fallback UI.
   * 
   * @param error - The error that was thrown
   * @returns Object with hasError set to true to trigger fallback UI
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  /**
   * Lifecycle method called after an error has been thrown in a child component
   * 
   * This method is called during the "commit" phase, so side-effects are allowed.
   * It's used for logging errors and performing cleanup operations.
   * 
   * @param error - The error that was thrown
   * @param errorInfo - Additional information about the error
   */
  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error information
    this.setState({
      error,
      errorInfo,
    })

    // Log error to centralized error handling system
    errorHandler.handle(error, {
      componentStack: errorInfo.componentStack,
      errorId: this.generateErrorId(),
      context: "ErrorBoundary",
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  /**
   * Generates a unique error ID for tracking and debugging
   * 
   * @returns A unique string identifier for the error
   */
  private generateErrorId(): string {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Handles the retry action to reset the error state
   */
  private handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  /**
   * Handles navigation to the home page
   */
  private handleGoHome = (): void => {
    window.location.href = "/"
  }

  /**
   * Renders the component
   * 
   * If an error has occurred, renders the fallback UI. Otherwise, renders
   * the child components normally.
   * 
   * @returns JSX.Element - The rendered component
   */
  override render(): ReactNode {
    // If an error has occurred, render fallback UI
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>

            {/* Error Title */}
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h1>

            {/* Error Message */}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Error Details (Development)
                </summary>
                <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>

            {/* Support Information */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                If this problem continues, please contact our support team with error ID:{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">
                  {this.generateErrorId()}
                </code>
              </p>
            </div>
          </div>
        </div>
      )
    }

    // Render children normally if no error
    return this.props.children
  }
} 