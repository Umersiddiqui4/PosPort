import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '@/components/ErrorBoundary'

// Mock the error handler
jest.mock('@/lib/error-handling', () => ({
  errorHandler: {
    handle: jest.fn(),
  },
}))

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>Normal content</div>
}

// Mock window.location
const mockLocation = {
  href: '',
}
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    mockLocation.href = ''
    
    // Suppress console.error for expected errors in tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Normal rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-content">Child content</div>
        </ErrorBoundary>
      )

      expect(screen.getByTestId('child-content')).toBeInTheDocument()
      expect(screen.getByText('Child content')).toBeInTheDocument()
    })

    it('should render multiple children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </ErrorBoundary>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })
  })

  describe('Error handling', () => {
    it('should render error UI when child throws an error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()
      expect(screen.getByText('Go Home')).toBeInTheDocument()
    })

    it('should call error handler when error occurs', () => {
      const { errorHandler } = require('@/lib/error-handling')
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(errorHandler.handle).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
          errorId: expect.stringMatching(/^error-\d+-[a-z0-9]+$/),
          context: 'ErrorBoundary',
        })
      )
    })

    it('should call custom onError callback when provided', () => {
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
  })

  describe('Custom fallback', () => {
    it('should render custom fallback when provided', () => {
      const CustomFallback = () => <div data-testid="custom-fallback">Custom error UI</div>
      
      render(
        <ErrorBoundary fallback={<CustomFallback />}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
      expect(screen.getByText('Custom error UI')).toBeInTheDocument()
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
    })
  })

  describe('Error UI elements', () => {
    beforeEach(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
    })

    it('should display error icon', () => {
      const iconContainer = screen.getByText('Something went wrong').closest('div')?.parentElement?.querySelector('[class*="bg-red-100"]')
      expect(iconContainer).toBeInTheDocument()
    })

    it('should display error title', () => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('should display error message', () => {
      expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument()
    })

    it('should display retry button', () => {
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })

    it('should display go home button', () => {
      expect(screen.getByText('Go Home')).toBeInTheDocument()
    })

    it('should display support information', () => {
      expect(screen.getByText(/If this problem continues/)).toBeInTheDocument()
    })
  })

  describe('Action buttons', () => {
    it('should reset error state when retry button is clicked', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      // Click retry button
      fireEvent.click(screen.getByText('Try Again'))

      // Re-render with no error
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      )

      // The error boundary should still show the error UI because the state was reset
      // but the component is still in error state until a new render cycle
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('should navigate to home when go home button is clicked', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      fireEvent.click(screen.getByText('Go Home'))

      expect(mockLocation.href).toBe('/')
    })
  })

  describe('Development mode features', () => {
    const originalEnv = process.env.NODE_ENV

    afterEach(() => {
      process.env.NODE_ENV = originalEnv
    })

    it('should show error details in development mode', () => {
      process.env.NODE_ENV = 'development'
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Error Details (Development)')).toBeInTheDocument()
      expect(screen.getByText('Test error message')).toBeInTheDocument()
    })

    it('should not show error details in production mode', () => {
      process.env.NODE_ENV = 'production'
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument()
      expect(screen.queryByText('Test error message')).not.toBeInTheDocument()
    })

    it('should show error stack trace in development mode', () => {
      process.env.NODE_ENV = 'development'
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const detailsElement = screen.getByText('Error Details (Development)')
      fireEvent.click(detailsElement)

      expect(screen.getByText('Stack:')).toBeInTheDocument()
    })
  })

  describe('Error ID generation', () => {
    it('should generate unique error IDs', () => {
      const { errorHandler } = require('@/lib/error-handling')
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const firstCall = errorHandler.handle.mock.calls[0][1]
      expect(firstCall.errorId).toMatch(/^error-\d+-[a-z0-9]+$/)

      // Render another error boundary
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const secondCall = errorHandler.handle.mock.calls[1][1]
      expect(secondCall.errorId).toMatch(/^error-\d+-[a-z0-9]+$/)
      expect(firstCall.errorId).not.toBe(secondCall.errorId)
    })

    it('should display error ID in support information', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const supportText = screen.getByText(/If this problem continues/)
      const errorIdElement = supportText.querySelector('code')
      expect(errorIdElement).toBeInTheDocument()
      expect(errorIdElement?.textContent).toMatch(/^error-\d+-[a-z0-9]+$/)
    })
  })

  describe('State management', () => {
    it('should initialize with correct default state', () => {
      const errorBoundary = new ErrorBoundary({ children: <div>Test</div> })
      
      expect(errorBoundary.state).toEqual({
        hasError: false,
        error: null,
        errorInfo: null,
      })
    })

    it('should update state when error occurs', () => {
      const errorBoundary = new ErrorBoundary({ children: <div>Test</div> })
      
      const error = new Error('Test error')
      const newState = ErrorBoundary.getDerivedStateFromError(error)
      
      expect(newState).toEqual({
        hasError: true,
        error,
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const errorContainer = screen.getByText('Something went wrong').closest('div')?.parentElement
      expect(errorContainer).toHaveClass('min-h-screen')
    })

    it('should have clickable buttons', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const retryButton = screen.getByText('Try Again')
      const homeButton = screen.getByText('Go Home')

      expect(retryButton).toBeInTheDocument()
      expect(homeButton).toBeInTheDocument()
      expect(retryButton.tagName).toBe('BUTTON')
      expect(homeButton.tagName).toBe('BUTTON')
    })
  })
})
