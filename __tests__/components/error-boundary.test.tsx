import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import ErrorBoundary from '@/components/ErrorBoundary';

// Mock the error handling system
jest.mock('@/lib/error-handling', () => ({
  errorHandler: {
    handle: jest.fn(),
  },
}));

// Mock window.location
const mockLocation = { href: '' };
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
  });

  it('shows error ID in support information', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Error ID:/)).toBeInTheDocument();
  });

  it('handles retry button click', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    // After retry, should show the child component again
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('handles go home button click', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const homeButton = screen.getByText('Go Home');
    fireEvent.click(homeButton);

    expect(window.location.href).toBe('/');
  });

  it('renders custom fallback when provided', () => {
    const CustomFallback = () => <div>Custom error UI</div>;

    render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = jest.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    (process.env as any).NODE_ENV = originalEnv;
  });

  it('does not show error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument();

    (process.env as any).NODE_ENV = originalEnv;
  });

  it('logs error to error handler', () => {
    const { errorHandler } = require('@/lib/error-handling');

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(errorHandler.handle).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
        errorId: expect.any(String),
        context: "ErrorBoundary",
      })
    );
  });

  it('generates unique error IDs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const errorIdText = screen.getByText(/Error ID:/).textContent;
    const errorId = errorIdText?.match(/error-\d+-\w+/)?.[0];

    expect(errorId).toBeDefined();
    expect(errorId).toMatch(/^error-\d+-[a-z0-9]+$/);
  });

  it('renders proper error UI structure', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Check main structure
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('handles multiple errors gracefully', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Initially no error
    expect(screen.getByText('No error')).toBeInTheDocument();

    // Trigger error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Retry should work
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('maintains error state correctly', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error should persist until retry
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // After retry, should reset
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('handles componentDidCatch errors', () => {
    const onError = jest.fn();
    const testError = new Error('Component did catch error');

    // Create a component that throws in componentDidCatch
    const ThrowInDidCatch = () => {
      React.useEffect(() => {
        throw testError;
      }, []);
      return <div>Should not render</div>;
    };

    render(
      <ErrorBoundary onError={onError}>
        <ThrowInDidCatch />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(testError, expect.any(Object));
  });

  it('renders with correct CSS classes', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const container = screen.getByText('Something went wrong').closest('div');
    expect(container).toHaveClass('min-h-screen', 'bg-gray-50');
  });

  it('handles empty children gracefully', () => {
    expect(() => render(<ErrorBoundary>{[]}</ErrorBoundary>)).not.toThrow();
  });

  it('handles null children gracefully', () => {
    expect(() => render(<ErrorBoundary>{null}</ErrorBoundary>)).not.toThrow();
  });

  it('preserves error information for debugging', () => {
    const onError = jest.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const error = onError.mock.calls[0][0] as Error;
    const errorInfo = onError.mock.calls[0][1] as React.ErrorInfo;

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Test error');
    expect(errorInfo).toHaveProperty('componentStack');
    expect(typeof errorInfo.componentStack).toBe('string');
  });
});
