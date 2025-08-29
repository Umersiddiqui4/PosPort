import React from 'react'
import { render, screen } from '@testing-library/react'
import { Progress } from '@/components/ui/progress'

describe('Progress', () => {
  it('should render progress with default props', () => {
    render(<Progress />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toBeInTheDocument()
  })

  it('should render progress with value', () => {
    render(<Progress value={75} />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toBeInTheDocument()
  })

  it('should render progress with max value', () => {
    render(<Progress value={100} max={100} />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toBeInTheDocument()
    expect(progress).toHaveAttribute('aria-valuemax', '100')
  })

  it('should apply custom className', () => {
    render(<Progress className="custom-progress" />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('custom-progress')
  })

  it('should have default styling classes', () => {
    render(<Progress />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('relative')
    expect(progress).toHaveClass('h-4')
    expect(progress).toHaveClass('w-full')
    expect(progress).toHaveClass('overflow-hidden')
    expect(progress).toHaveClass('rounded-full')
    expect(progress).toHaveClass('bg-secondary')
  })

  it('should handle zero value', () => {
    render(<Progress value={0} />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toBeInTheDocument()
  })

  it('should handle max value', () => {
    render(<Progress value={100} />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toBeInTheDocument()
  })

  it('should handle undefined value', () => {
    render(<Progress value={undefined} />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toBeInTheDocument()
  })
})
