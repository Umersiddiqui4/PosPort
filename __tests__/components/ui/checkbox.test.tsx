import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox } from '@/components/ui/checkbox'

describe('Checkbox', () => {
  it('should render checkbox with default props', () => {
    render(<Checkbox />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('should render checkbox with id', () => {
    render(<Checkbox id="test-checkbox" />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('id', 'test-checkbox')
  })

  it('should handle checked state', () => {
    render(<Checkbox checked />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('should handle unchecked state', () => {
    render(<Checkbox checked={false} />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('should handle onChange events', () => {
    const handleChange = jest.fn()
    render(<Checkbox onChange={handleChange} />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Checkbox disabled />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('should have proper accessibility attributes', () => {
    render(<Checkbox id="test" aria-label="Test checkbox" />)
    
    const checkbox = screen.getByLabelText('Test checkbox')
    expect(checkbox).toHaveAttribute('id', 'test')
  })

  it('should apply custom className', () => {
    render(<Checkbox className="custom-checkbox" />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('custom-checkbox')
  })

  it('should have default styling classes', () => {
    render(<Checkbox />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('peer')
    expect(checkbox).toHaveClass('h-4')
    expect(checkbox).toHaveClass('w-4')
  })

  it('should forward ref', () => {
    const ref = jest.fn()
    render(<Checkbox ref={ref} />)
    
    expect(ref).toHaveBeenCalled()
  })

  it('should handle required attribute', () => {
    render(<Checkbox required />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeRequired()
  })

  it('should handle name attribute', () => {
    render(<Checkbox name="test-name" />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('name', 'test-name')
  })
})
