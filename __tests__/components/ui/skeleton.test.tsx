import React from 'react'
import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton', () => {
  it('should render skeleton with default props', () => {
    render(<Skeleton />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<Skeleton className="custom-class" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('custom-class')
  })

  it('should have default skeleton styling', () => {
    render(<Skeleton />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('animate-pulse')
    expect(skeleton).toHaveClass('rounded-md')
    expect(skeleton).toHaveClass('bg-muted')
  })

  it('should render with custom dimensions', () => {
    render(<Skeleton className="w-32 h-8" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('w-32')
    expect(skeleton).toHaveClass('h-8')
  })

  it('should be accessible', () => {
    render(<Skeleton aria-label="Loading content" />)
    
    const skeleton = screen.getByLabelText('Loading content')
    expect(skeleton).toBeInTheDocument()
  })
})
