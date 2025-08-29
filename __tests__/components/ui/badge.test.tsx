import React from 'react'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  it('should render badge with default props', () => {
    render(<Badge>Test Badge</Badge>)
    
    const badge = screen.getByText('Test Badge')
    expect(badge).toBeInTheDocument()
  })

  it('should render badge with variant', () => {
    const { rerender } = render(<Badge variant="default">Default Badge</Badge>)
    let badge = screen.getByText('Default Badge')
    expect(badge).toHaveClass('bg-primary')

    rerender(<Badge variant="secondary">Secondary Badge</Badge>)
    badge = screen.getByText('Secondary Badge')
    expect(badge).toHaveClass('bg-secondary')

    rerender(<Badge variant="destructive">Destructive Badge</Badge>)
    badge = screen.getByText('Destructive Badge')
    expect(badge).toHaveClass('bg-destructive')

    rerender(<Badge variant="outline">Outline Badge</Badge>)
    badge = screen.getByText('Outline Badge')
    expect(badge).toHaveClass('text-foreground')
  })

  it('should apply custom className', () => {
    render(<Badge className="custom-badge">Test Badge</Badge>)
    
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('custom-badge')
  })

  it('should have default styling classes', () => {
    render(<Badge>Test Badge</Badge>)
    
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('inline-flex')
    expect(badge).toHaveClass('items-center')
    expect(badge).toHaveClass('rounded-full')
    expect(badge).toHaveClass('border')
    expect(badge).toHaveClass('px-2.5')
    expect(badge).toHaveClass('py-0.5')
    expect(badge).toHaveClass('text-xs')
    expect(badge).toHaveClass('font-semibold')
    expect(badge).toHaveClass('transition-colors')
  })

  it('should forward ref', () => {
    const ref = jest.fn()
    render(<Badge ref={ref}>Test Badge</Badge>)
    
    expect(ref).toHaveBeenCalled()
  })

  it('should handle different content types', () => {
    render(
      <Badge>
        <span>Complex</span> <strong>Badge</strong> <em>Content</em>
      </Badge>
    )
    
    expect(screen.getByText('Complex')).toBeInTheDocument()
    expect(screen.getByText('Badge')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})

