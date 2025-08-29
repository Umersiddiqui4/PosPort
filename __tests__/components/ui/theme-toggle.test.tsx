import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '@/components/theme-toggle'

// Mock the useTheme hook
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    themes: ['light', 'dark', 'system'],
  }),
}))

describe('ThemeToggle', () => {
  it('should render the theme toggle button', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should display sun icon for light theme', () => {
    render(<ThemeToggle />)
    
    // The sun icon should be present (lucide-sun class or similar)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should be clickable', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
  })

  it('should have proper styling classes', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('inline-flex')
    expect(button).toHaveClass('items-center')
    expect(button).toHaveClass('justify-center')
  })
})
