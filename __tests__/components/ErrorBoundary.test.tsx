import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import ErrorBoundary from '@/lib/error-handling/errorBoundary'

// Mock the error handling system
jest.mock('@/lib/error-handling', () => ({
  errorHandler: {
    handle: jest.fn(),
  },
  ErrorType: {
    UNKNOWN: 'UNKNOWN',
  },
  createError: jest.fn(),
}))

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument()
  })

  it('shows error ID', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/Error ID:/)).toBeInTheDocument()
  })

  it('handles retry button click', () => {
    const onRetry = jest.fn();
    
    render(
      <ErrorBoundary onRetry={onRetry}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    // Verify the onRetry callback was called
    expect(onRetry).toHaveBeenCalled()
  })

  it('handles go home button click', () => {
    const mockLocation = { href: '' }
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
    })

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const homeButton = screen.getByText('Go Home')
    fireEvent.click(homeButton)

    expect(window.location.href).toBe('/')
  })

  it('handles report error button click', async () => {
    const mockClipboard = {
      writeText: jest.fn().mockResolvedValue(undefined),
    }
    Object.assign(navigator, { clipboard: mockClipboard })

    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const reportButton = screen.getByText('Report Error')
    await fireEvent.click(reportButton)

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockClipboard.writeText).toHaveBeenCalled()
    expect(mockAlert).toHaveBeenCalledWith(
      'Error report copied to clipboard. Please send this to support.'
    )

    mockAlert.mockRestore()
  })

  it('renders custom fallback when provided', () => {
    const CustomFallback = () => <div>Custom error UI</div>

    render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error UI')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('calls onError callback when error occurs', () => {
    const onError = jest.fn()

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    )
  })

  it('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    ;(process.env as any).NODE_ENV = 'development'

    render(
      <ErrorBoundary showErrorDetails={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const detailsElement = screen.getByText('Error Details')
    expect(detailsElement).toBeInTheDocument()

    ;(process.env as any).NODE_ENV = originalEnv
  })

  it('does not show error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV
    ;(process.env as any).NODE_ENV = 'production'

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const detailsElement = screen.queryByText('Error Details (Development)')
    expect(detailsElement).not.toBeInTheDocument()

    ;(process.env as any).NODE_ENV = originalEnv
  })
})
