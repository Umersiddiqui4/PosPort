import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from '@/components/ui/textarea'

describe('Textarea', () => {
  it('should render textarea with default props', () => {
    render(<Textarea />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
  })

  it('should render textarea with placeholder', () => {
    render(<Textarea placeholder="Enter your message" />)
    
    const textarea = screen.getByPlaceholderText('Enter your message')
    expect(textarea).toBeInTheDocument()
  })

  it('should render textarea with value', () => {
    render(<Textarea value="Test message" readOnly />)
    
    const textarea = screen.getByDisplayValue('Test message')
    expect(textarea).toBeInTheDocument()
  })

  it('should handle onChange events', () => {
    const handleChange = jest.fn()
    render(<Textarea onChange={handleChange} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'test' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Textarea disabled />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
  })

  it('should have proper accessibility attributes', () => {
    render(<Textarea id="message" name="message" aria-label="Message input" />)
    
    const textarea = screen.getByLabelText('Message input')
    expect(textarea).toHaveAttribute('id', 'message')
    expect(textarea).toHaveAttribute('name', 'message')
  })

  it('should apply custom className', () => {
    render(<Textarea className="custom-textarea" />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('custom-textarea')
  })

  it('should have default styling classes', () => {
    render(<Textarea />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('flex')
    expect(textarea).toHaveClass('min-h-[80px]')
    expect(textarea).toHaveClass('w-full')
  })

  it('should forward ref', () => {
    const ref = jest.fn()
    render(<Textarea ref={ref} />)
    
    expect(ref).toHaveBeenCalled()
  })

  it('should handle required attribute', () => {
    render(<Textarea required />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeRequired()
  })

  it('should handle rows attribute', () => {
    render(<Textarea rows={5} />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('rows', '5')
  })
})

