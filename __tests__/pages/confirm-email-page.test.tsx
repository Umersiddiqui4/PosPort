import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmailVerified from '@/app/confirm-email/page';

// Mock the useVerifyEmail hook
jest.mock('@/hooks/useVerifyEmail', () => ({
  useVerifyEmail: jest.fn(),
}));

// Create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Mock window.location
const mockLocation = { search: '?hash=test-token' };
Object.defineProperty(window, 'location', { value: mockLocation, writable: true });

// Mock URLSearchParams
global.URLSearchParams = jest.fn().mockImplementation(() => ({
  get: jest.fn((key) => key === 'hash' ? 'test-token' : null),
})) as any;

describe('EmailVerified', () => {
  const Wrapper = createWrapper();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.search = '?hash=test-token';

    // Setup default mock using require
    const { useVerifyEmail } = require('@/hooks/useVerifyEmail');
    useVerifyEmail.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
    });
  });

  it('renders initial verifying state', () => {
    render(<EmailVerified />, { wrapper: Wrapper });
    expect(screen.getByText('Verifying your email...')).toBeInTheDocument();
  });

  it('renders with proper component structure', () => {
    render(<EmailVerified />, { wrapper: Wrapper });

    const container = screen.getByText('Verifying your email...').closest('div');
    expect(container).toBeInTheDocument();
  });

  it('handles missing token gracefully', () => {
    mockLocation.search = '';
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn(() => null),
    })) as any;

    render(<EmailVerified />, { wrapper: Wrapper });
    expect(screen.getByText('No token found in URL.')).toBeInTheDocument();
  });
});