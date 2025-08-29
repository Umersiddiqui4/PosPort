import React from 'react'
import { render, screen } from '@testing-library/react'
import { Separator } from '@/components/ui/separator'

describe('Separator', () => {
  it('should render separator with default props', () => {
    render(<Separator />)
    
    const separator = screen.getByRole('separator')
    expect(separator).toBeInTheDocument()
  })

  it('should render separator with orientation', () => {
    const { rerender } = render(<Separator orientation="horizontal" />)
    let separator = screen.getByRole('separator')
    expect(separator).toHaveClass('h-px')

    rerender(<Separator orientation="vertical" />)
    separator = screen.getByRole('separator')
    expect(separator).toHaveClass('w-px')
    expect(separator).toHaveClass('h-full')
  })

  it('should apply custom className', () => {
    render(<Separator className="custom-separator" />)
    
    const separator = screen.getByRole('separator')
    expect(separator).toHaveClass('custom-separator')
  })

  it('should have default styling classes', () => {
    render(<Separator />)
    
    const separator = screen.getByRole('separator')
    expect(separator).toHaveClass('shrink-0')
    expect(separator).toHaveClass('bg-border')
  })

  it('should forward ref', () => {
    const ref = jest.fn()
    render(<Separator ref={ref} />)
    
    expect(ref).toHaveBeenCalled()
  })

  it('should handle decorative prop', () => {
    render(<Separator decorative />)
    
    const separator = screen.getByRole('separator')
    expect(separator).toHaveAttribute('aria-hidden', 'true')
  })

  it('should handle decorative false', () => {
    render(<Separator decorative={false} />)
    
    const separator = screen.getByRole('separator')
    expect(separator).not.toHaveAttribute('aria-hidden', 'true')
  })
})
