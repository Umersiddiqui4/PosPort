import React from 'react'
import { render, screen } from '@testing-library/react'
import { Slider } from '@/components/ui/slider'

describe('Slider', () => {
  it('should render slider with default props', () => {
    render(<Slider />)
    
    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
  })

  it('should render slider with value', () => {
    render(<Slider defaultValue={[50]} />)
    
    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('aria-valuenow', '50')
  })

  it('should render slider with max value', () => {
    render(<Slider max={100} />)
    
    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('aria-valuemax', '100')
  })

  it('should render slider with min value', () => {
    render(<Slider min={0} />)
    
    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('aria-valuemin', '0')
  })

  it('should handle disabled state', () => {
    render(<Slider disabled />)
    
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('data-disabled')
  })
})
