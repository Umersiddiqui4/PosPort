import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from '@/components/ui/switch'

describe('Switch', () => {
  it('should render switch with default props', () => {
    render(<Switch />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })

  it('should render switch with id', () => {
    render(<Switch id="test-switch" />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('id', 'test-switch')
  })

  it('should handle checked state', () => {
    render(<Switch checked />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('data-state', 'checked')
  })

  it('should handle unchecked state', () => {
    render(<Switch checked={false} />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('data-state', 'unchecked')
  })

  it('should handle onChange events', () => {
    const handleChange = jest.fn()
    render(<Switch onChange={handleChange} />)
    
    const switchElement = screen.getByRole('switch')
    fireEvent.click(switchElement)
    
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Switch disabled />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeDisabled()
  })

  it('should have proper accessibility attributes', () => {
    render(<Switch id="test" aria-label="Test switch" />)
    
    const switchElement = screen.getByLabelText('Test switch')
    expect(switchElement).toHaveAttribute('id', 'test')
  })

  it('should apply custom className', () => {
    render(<Switch className="custom-switch" />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('custom-switch')
  })

  it('should have default styling classes', () => {
    render(<Switch />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('peer')
    expect(switchElement).toHaveClass('inline-flex')
    expect(switchElement).toHaveClass('h-6')
    expect(switchElement).toHaveClass('w-11')
  })

  it('should forward ref', () => {
    const ref = jest.fn()
    render(<Switch ref={ref} />)
    
    expect(ref).toHaveBeenCalled()
  })

  it('should handle name attribute', () => {
    render(<Switch name="test-name" />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('name', 'test-name')
  })

  it('should handle value attribute', () => {
    render(<Switch value="test-value" />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('value', 'test-value')
  })
})
