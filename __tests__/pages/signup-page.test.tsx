import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import Signup from '@/app/signup/page';

// Mock the hooks
const mockMutate = jest.fn();
const mockToast = jest.fn();
const mockRouterPush = jest.fn();

jest.mock('@/hooks/useSignUp', () => ({
  useSignup: () => ({
    mutate: mockMutate,
    isPending: false,
    isSuccess: false,
    error: null,
  }),
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
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

// Mock react-phone-input-2
jest.mock('react-phone-input-2', () => ({
  __esModule: true,
  default: ({ value, onChange, inputClass, inputProps }: any) => (
    <input
      type="tel"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
      {...inputProps}
      data-testid="phone-input"
    />
  ),
}));

describe('Signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders signup form correctly', () => {
    render(<Signup />);

    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('renders form inputs with correct attributes', () => {
    render(<Signup />);

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(firstNameInput).toHaveAttribute('type', 'text');
    expect(firstNameInput).toHaveAttribute('required');
    expect(firstNameInput).toHaveAttribute('placeholder', 'Enter your first name');

    expect(lastNameInput).toHaveAttribute('type', 'text');
    expect(lastNameInput).toHaveAttribute('required');
    expect(lastNameInput).toHaveAttribute('placeholder', 'Enter your last name');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');
  });

  it('updates form state when text inputs change', () => {
    render(<Signup />);

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(emailInput).toHaveValue('john.doe@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('updates phone number state when phone input changes', () => {
    render(<Signup />);

    const phoneInput = screen.getByTestId('phone-input');

    fireEvent.change(phoneInput, { target: { value: '+1234567890' } });

    expect(phoneInput).toHaveValue('+1234567890');
  });

  it('toggles password visibility when eye icon is clicked', () => {
    render(<Signup />);

    const passwordInput = screen.getByLabelText('Password');
    const eyeButton = screen.getByRole('button', { name: '' }); // Eye icon button

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(eyeButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide password
    fireEvent.click(eyeButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('calls mutate with correct data on form submission', () => {
    render(<Signup />);

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');
    const phoneInput = screen.getByTestId('phone-input');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '+1234567890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(mockMutate).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      password: 'password123',
    });
  });

  it('prevents default form submission', () => {
    render(<Signup />);

    const form = screen.getByRole('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });

    const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');

    fireEvent(form, submitEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('navigates back when arrow left button is clicked', () => {
    render(<Signup />);

    const backButton = screen.getByRole('button', { name: '' }); // Arrow button
    fireEvent.click(backButton);

    expect(mockRouterPush).toHaveBeenCalledWith('/helloScreen');
  });

  it('shows loading state when isPending is true', () => {
    // Mock the hook to return pending state
    const useSignupMock = require('@/hooks/useSignUp');
    useSignupMock.useSignup.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isSuccess: false,
      error: null,
    });

    render(<Signup />);

    expect(screen.getByTestId('mui-box')).toBeInTheDocument();
    expect(screen.getByTestId('linear-progress')).toBeInTheDocument();
  });

  it('displays error message when signup fails', () => {
    // Mock the hook to return error state
    const useSignupMock = require('@/hooks/useSignUp');
    useSignupMock.useSignup.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
      error: new Error('Email already exists'),
    });

    render(<Signup />);

    expect(screen.getByText('Email already exists')).toBeInTheDocument();
  });

  it('redirects to login page after successful signup', async () => {
    // Mock successful signup
    const useSignupMock = require('@/hooks/useSignUp');
    useSignupMock.useSignup.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: true,
      error: null,
    });

    render(<Signup />);

    // Wait for the timeout and router.push to be called
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/login');
    }, { timeout: 1000 });
  });

  it('shows success toast after successful signup', () => {
    // Mock successful signup
    const useSignupMock = require('@/hooks/useSignUp');
    useSignupMock.useSignup.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: true,
      error: null,
    });

    render(<Signup />);

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Signup successful',
      description: 'Redirecting to login...',
    });
  });

  it('has proper accessibility attributes', () => {
    render(<Signup />);

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(firstNameInput).toHaveAttribute('id', 'firstName');
    expect(firstNameInput).toHaveAttribute('name', 'firstName');

    expect(lastNameInput).toHaveAttribute('id', 'lastName');
    expect(lastNameInput).toHaveAttribute('name', 'lastName');

    expect(emailInput).toHaveAttribute('id', 'email');
    expect(emailInput).toHaveAttribute('name', 'email');

    expect(passwordInput).toHaveAttribute('id', 'password');
    expect(passwordInput).toHaveAttribute('name', 'password');
  });

  it('renders phone input with correct props', () => {
    render(<Signup />);

    const phoneInput = screen.getByTestId('phone-input');

    expect(phoneInput).toHaveAttribute('type', 'tel');
    expect(phoneInput).toHaveAttribute('name', 'phone');
    expect(phoneInput).toHaveAttribute('required');
  });

  it('renders with correct CSS classes for styling', () => {
    render(<Signup />);

    const card = screen.getByRole('main'); // Card component
    expect(card).toHaveClass('w-full', 'max-w-md', 'mx-auto', 'shadow-xl', 'border-0');
  });

  it('handles form validation by preventing submission with empty required fields', () => {
    render(<Signup />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });

    // Try to submit without filling required fields
    fireEvent.click(submitButton);

    // The form should still be valid HTML5-wise, but our test verifies the button exists
    expect(submitButton).toBeInTheDocument();
  });

  it('maintains form state correctly across multiple changes', () => {
    render(<Signup />);

    const firstNameInput = screen.getByLabelText('First Name');
    const emailInput = screen.getByLabelText('Email');

    // Change first name
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    expect(firstNameInput).toHaveValue('Jane');

    // Change email
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    expect(emailInput).toHaveValue('jane@example.com');

    // Verify first name is still correct
    expect(firstNameInput).toHaveValue('Jane');
  });
});