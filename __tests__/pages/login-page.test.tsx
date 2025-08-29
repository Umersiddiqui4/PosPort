import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import LoginEmployeePage from '@/app/login/page';

// Mock the hooks
const mockMutate = jest.fn();
const mockToast = jest.fn();
const mockRouterPush = jest.fn();
const mockHandleGoogleLogin = jest.fn();

jest.mock('@/hooks/useLogin', () => ({
  useLogin: () => ({
    mutate: mockMutate,
    data: null,
    isSuccess: false,
    error: null,
    isPending: false,
  }),
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

jest.mock('@/hooks/useGoogleAuth', () => ({
  useGoogleAuth: () => ({
    handleGoogleLogin: mockHandleGoogleLogin,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

// Mock the store
jest.mock('@/lib/store', () => ({
  useUserDataStore: () => ({
    login: jest.fn(),
  }),
}));

// Mock MUI components
jest.mock('@mui/material/Box', () => ({
  __esModule: true,
  default: ({ children, sx }: any) => <div data-testid="mui-box" style={sx}>{children}</div>,
}));

jest.mock('@mui/material/LinearProgress', () => ({
  __esModule: true,
  default: ({ color }: any) => <div data-testid="linear-progress" data-color={color} />,
}));

describe('LoginEmployeePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<LoginEmployeePage />);

    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });

  it('renders form inputs with correct attributes', () => {
    render(<LoginEmployeePage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('placeholder', 'Enter password');
  });

  it('updates form state when inputs change', () => {
    render(<LoginEmployeePage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls mutate with correct data on form submission', () => {
    render(<LoginEmployeePage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(mockMutate).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('prevents default form submission', () => {
    render(<LoginEmployeePage />);

    const form = screen.getByRole('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });

    // Spy on preventDefault
    const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');

    fireEvent(form, submitEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('calls handleGoogleLogin when Google button is clicked', () => {
    render(<LoginEmployeePage />);

    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(googleButton);

    expect(mockHandleGoogleLogin).toHaveBeenCalled();
  });

  it('navigates back when arrow left button is clicked', () => {
    render(<LoginEmployeePage />);

    const backButton = screen.getByRole('button', { name: '' }); // Arrow button
    fireEvent.click(backButton);

    expect(mockRouterPush).toHaveBeenCalledWith('/helloScreen');
  });

  it('shows loading state when isPending is true', () => {
    // Mock the hook to return pending state
    const useLoginMock = require('@/hooks/useLogin');
    useLoginMock.useLogin.mockReturnValue({
      mutate: mockMutate,
      data: null,
      isSuccess: false,
      error: null,
      isPending: true,
    });

    render(<LoginEmployeePage />);

    expect(screen.getByTestId('mui-box')).toBeInTheDocument();
    expect(screen.getByTestId('linear-progress')).toBeInTheDocument();
  });

  it('displays error message when login fails', () => {
    // Mock the hook to return error state
    const useLoginMock = require('@/hooks/useLogin');
    useLoginMock.useLogin.mockReturnValue({
      mutate: mockMutate,
      data: null,
      isSuccess: false,
      error: { response: { data: { message: 'Invalid credentials' } } },
      isPending: false,
    });

    render(<LoginEmployeePage />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('handles successful login with data transformation', () => {
    // Mock the hook to return success state
    const mockLoginStore = jest.fn();
    const useUserDataStoreMock = require('@/lib/store');
    useUserDataStoreMock.useUserDataStore.mockReturnValue({
      login: mockLoginStore,
    });

    const useLoginMock = require('@/hooks/useLogin');
    useLoginMock.useLogin.mockReturnValue({
      mutate: mockMutate,
      data: {
        data: {
          user: { id: 1, email: 'test@example.com' },
          tokens: {
            access: { token: 'access-token', expires: '2024-01-01' },
            refresh: { token: 'refresh-token', expires: '2024-01-01' },
          },
        },
      },
      isSuccess: true,
      error: null,
      isPending: false,
    });

    render(<LoginEmployeePage />);

    expect(mockLoginStore).toHaveBeenCalledWith({
      user: { id: 1, email: 'test@example.com' },
      tokens: {
        access: {
          token: 'access-token',
          expiresIn: '2024-01-01',
        },
        refresh: {
          token: 'refresh-token',
          expiresIn: '2024-01-01',
        },
      },
    });
  });

  it('redirects to home page after successful login', async () => {
    // Mock successful login
    const useLoginMock = require('@/hooks/useLogin');
    useLoginMock.useLogin.mockReturnValue({
      mutate: mockMutate,
      data: {
        data: {
          user: { id: 1, email: 'test@example.com' },
          tokens: {
            access: { token: 'access-token', expires: '2024-01-01' },
            refresh: { token: 'refresh-token', expires: '2024-01-01' },
          },
        },
      },
      isSuccess: true,
      error: null,
      isPending: false,
    });

    render(<LoginEmployeePage />);

    // Wait for the timeout and router.push to be called
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/');
    }, { timeout: 1000 });
  });

  it('shows success toast after successful login', () => {
    // Mock successful login
    const useLoginMock = require('@/hooks/useLogin');
    useLoginMock.useLogin.mockReturnValue({
      mutate: mockMutate,
      data: {
        data: {
          user: { id: 1, email: 'test@example.com' },
          tokens: {
            access: { token: 'access-token', expires: '2024-01-01' },
            refresh: { token: 'refresh-token', expires: '2024-01-01' },
          },
        },
      },
      isSuccess: true,
      error: null,
      isPending: false,
    });

    render(<LoginEmployeePage />);

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Login successful',
      description: 'Redirecting...',
    });
  });

  it('has proper accessibility attributes', () => {
    render(<LoginEmployeePage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toHaveAttribute('id', 'email');
    expect(emailInput).toHaveAttribute('name', 'email');

    expect(passwordInput).toHaveAttribute('id', 'password');
    expect(passwordInput).toHaveAttribute('name', 'password');
  });

  it('renders with correct CSS classes for styling', () => {
    render(<LoginEmployeePage />);

    const card = screen.getByRole('main'); // Card component
    expect(card).toHaveClass('w-full', 'max-w-md', 'mx-auto', 'shadow-xl', 'border-0');
  });
});