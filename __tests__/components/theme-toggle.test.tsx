import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeToggle } from '@/components/theme-toggle'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    setTheme: jest.fn(),
  })),
}))

describe('ThemeToggle', () => {
  it('should render the theme toggle button', () => {
    render(<ThemeToggle />)
    
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Toggle theme')).toBeInTheDocument()
  })

  it('should render sun and moon icons', () => {
    render(<ThemeToggle />)
    
    // Check for the sun icon by looking for the SVG with sun-related classes
    const sunIcon = document.querySelector('[class*="rotate-0"]')
    expect(sunIcon).toBeInTheDocument()
    
    // Check for the moon icon by looking for the SVG with moon-related classes
    const moonIcon = document.querySelector('[class*="rotate-90"]')
    expect(moonIcon).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-haspopup', 'menu')
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('should have proper styling classes', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('relative')
  })

  it('should have proper button structure', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-state', 'closed')
  })
})
