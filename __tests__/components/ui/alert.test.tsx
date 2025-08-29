import React from 'react'
import { render, screen } from '@testing-library/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

describe('Alert Components', () => {
  describe('Alert', () => {
    it('should render alert with default props', () => {
      render(<Alert>Alert content</Alert>)
      
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('should render alert with variant', () => {
      const { rerender } = render(<Alert variant="default">Default Alert</Alert>)
      let alert = screen.getByRole('alert')
      expect(alert).toHaveClass('border')

      rerender(<Alert variant="destructive">Destructive Alert</Alert>)
      alert = screen.getByRole('alert')
      expect(alert).toHaveClass('border-destructive/50')
      expect(alert).toHaveClass('text-destructive')
      expect(alert).toHaveClass('dark:border-destructive')
    })

    it('should apply custom className', () => {
      render(<Alert className="custom-alert">Alert content</Alert>)
      
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('custom-alert')
    })

    it('should have default styling classes', () => {
      render(<Alert>Alert content</Alert>)
      
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('relative')
      expect(alert).toHaveClass('w-full')
      expect(alert).toHaveClass('rounded-lg')
      expect(alert).toHaveClass('border')
    })
  })

  describe('AlertTitle', () => {
    it('should render alert title', () => {
      render(<AlertTitle>Alert Title</AlertTitle>)
      
      const title = screen.getByText('Alert Title')
      expect(title).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<AlertTitle className="custom-title">Alert Title</AlertTitle>)
      
      const title = screen.getByText('Alert Title')
      expect(title).toHaveClass('custom-title')
    })

    it('should have default styling classes', () => {
      render(<AlertTitle>Alert Title</AlertTitle>)
      
      const title = screen.getByText('Alert Title')
      expect(title).toHaveClass('mb-1')
      expect(title).toHaveClass('font-medium')
      expect(title).toHaveClass('leading-none')
    })
  })

  describe('AlertDescription', () => {
    it('should render alert description', () => {
      render(<AlertDescription>Alert Description</AlertDescription>)
      
      const description = screen.getByText('Alert Description')
      expect(description).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<AlertDescription className="custom-description">Alert Description</AlertDescription>)
      
      const description = screen.getByText('Alert Description')
      expect(description).toHaveClass('custom-description')
    })

    it('should have default styling classes', () => {
      render(<AlertDescription>Alert Description</AlertDescription>)
      
      const description = screen.getByText('Alert Description')
      expect(description).toHaveClass('text-sm')
    })
  })

  describe('Complete Alert Structure', () => {
    it('should render complete alert with title and description', () => {
      render(
        <Alert>
          <AlertTitle>Test Title</AlertTitle>
          <AlertDescription>Test Description</AlertDescription>
        </Alert>
      )
      
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })
  })
})
