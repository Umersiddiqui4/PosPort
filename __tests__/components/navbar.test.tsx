import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useLogout } from '@/hooks/useLogout'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock hooks
jest.mock('@/hooks/useCurrentUser')
jest.mock('@/hooks/useLogout')

const mockPush = jest.fn()
const mockLogout = jest.fn()

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useCurrentUser as jest.Mock).mockReturnValue({
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'POSPORT_ADMIN',
      },
    })
    ;(useLogout as jest.Mock).mockReturnValue({
      logout: mockLogout,
      isLoading: false,
    })
  })

  it('should render navbar with user information', () => {
    render(<Navbar />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('should display user role', () => {
    render(<Navbar />)
    
    expect(screen.getByText('POSPORT_ADMIN')).toBeInTheDocument()
  })

  it('should handle user menu toggle', () => {
    render(<Navbar />)
    
    const userMenuButton = screen.getByRole('button', { name: /user menu/i })
    fireEvent.click(userMenuButton)
    
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('should handle profile navigation', () => {
    render(<Navbar />)
    
    const userMenuButton = screen.getByRole('button', { name: /user menu/i })
    fireEvent.click(userMenuButton)
    
    const profileButton = screen.getByText('Profile')
    fireEvent.click(profileButton)
    
    expect(mockPush).toHaveBeenCalledWith('/account')
  })

  it('should handle settings navigation', () => {
    render(<Navbar />)
    
    const userMenuButton = screen.getByRole('button', { name: /user menu/i })
    fireEvent.click(userMenuButton)
    
    const settingsButton = screen.getByText('Settings')
    fireEvent.click(settingsButton)
    
    expect(mockPush).toHaveBeenCalledWith('/settings')
  })

  it('should handle logout', () => {
    render(<Navbar />)
    
    const userMenuButton = screen.getByRole('button', { name: /user menu/i })
    fireEvent.click(userMenuButton)
    
    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)
    
    expect(mockLogout).toHaveBeenCalled()
  })

  it('should show loading state during logout', () => {
    ;(useLogout as jest.Mock).mockReturnValue({
      logout: mockLogout,
      isLoading: true,
    })

    render(<Navbar />)
    
    const userMenuButton = screen.getByRole('button', { name: /user menu/i })
    fireEvent.click(userMenuButton)
    
    const logoutButton = screen.getByText('Logout')
    expect(logoutButton).toBeDisabled()
  })

  it('should handle user without name', () => {
    ;(useCurrentUser as jest.Mock).mockReturnValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        role: 'USER',
      },
    })

    render(<Navbar />)
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.queryByText('Test User')).not.toBeInTheDocument()
  })

  it('should handle user without email', () => {
    ;(useCurrentUser as jest.Mock).mockReturnValue({
      user: {
        id: 'user-1',
        name: 'Test User',
        role: 'USER',
      },
    })

    render(<Navbar />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument()
  })

  it('should handle user without role', () => {
    ;(useCurrentUser as jest.Mock).mockReturnValue({
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
    })

    render(<Navbar />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.queryByText('POSPORT_ADMIN')).not.toBeInTheDocument()
  })

  it('should handle no user', () => {
    ;(useCurrentUser as jest.Mock).mockReturnValue({
      user: null,
    })

    render(<Navbar />)
    
    expect(screen.queryByText('Test User')).not.toBeInTheDocument()
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument()
  })

  it('should close user menu when clicking outside', () => {
    render(<Navbar />)
    
    const userMenuButton = screen.getByRole('button', { name: /user menu/i })
    fireEvent.click(userMenuButton)
    
    expect(screen.getByText('Profile')).toBeInTheDocument()
    
    // Click outside the menu
    fireEvent.click(document.body)
    
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
  })

  it('should handle keyboard navigation', () => {
    render(<Navbar />)
    
    const userMenuButton = screen.getByRole('button', { name: /user menu/i })
    fireEvent.click(userMenuButton)
    
    // Press Escape key
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
  })

  it('should handle different user roles', () => {
    const roles = ['USER', 'COMPANY_OWNER', 'POSPORT_ADMIN', 'LOCATION_MANAGER']
    
    roles.forEach(role => {
      ;(useCurrentUser as jest.Mock).mockReturnValue({
        user: {
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com',
          role,
        },
      })

      const { unmount } = render(<Navbar />)
      
      expect(screen.getByText(role)).toBeInTheDocument()
      
      unmount()
    })
  })
})

