import React from 'react'
import { render, screen } from '@testing-library/react'
import { Label } from '@/components/ui/label'

describe('Label', () => {
  it('should render label with text', () => {
    render(<Label>Test Label</Label>)
    
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
  })

  it('should render label with htmlFor attribute', () => {
    render(<Label htmlFor="test-input">Test Label</Label>)
    
    const label = screen.getByText('Test Label')
    expect(label).toHaveAttribute('htmlFor', 'test-input')
  })

  it('should apply custom className', () => {
    render(<Label className="custom-label">Test Label</Label>)
    
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('custom-label')
  })

  it('should have default styling classes', () => {
    render(<Label>Test Label</Label>)
    
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('text-sm')
    expect(label).toHaveClass('font-medium')
    expect(label).toHaveClass('leading-none')
  })

  it('should be accessible', () => {
    render(<Label htmlFor="test-input">Test Label</Label>)
    
    const label = screen.getByText('Test Label')
    expect(label).toHaveAttribute('htmlFor', 'test-input')
  })

  it('should handle disabled state', () => {
    render(<Label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Test Label</Label>)
    
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed')
    expect(label).toHaveClass('peer-disabled:opacity-70')
  })

  it('should forward ref', () => {
    const ref = jest.fn()
    render(<Label ref={ref}>Test Label</Label>)
    
    expect(ref).toHaveBeenCalled()
  })

  it('should handle complex content', () => {
    render(
      <Label>
        <span>Complex</span> <strong>Label</strong> <em>Content</em>
      </Label>
    )
    
    expect(screen.getByText('Complex')).toBeInTheDocument()
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
