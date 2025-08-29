import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CartSummary from '@/components/cart-summary'

describe('CartSummary', () => {
  const mockItems = [
    {
      id: '1',
      name: 'Test Product 1',
      price: 10.99,
      quantity: 2,
    },
    {
      id: '2',
      name: 'Test Product 2',
      price: 15.50,
      quantity: 1,
    },
  ]

  const mockOnCheckout = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render cart summary with items', () => {
    render(<CartSummary items={mockItems} total={37.48} onCheckout={mockOnCheckout} />)
    
    expect(screen.getByText('3 Items')).toBeInTheDocument() // 2 + 1 = 3 total items
    expect(screen.getByText('Total: 37.48 PKR')).toBeInTheDocument()
  })

  it('should display correct total items count', () => {
    render(<CartSummary items={mockItems} total={37.48} onCheckout={mockOnCheckout} />)
    
    expect(screen.getByText('3 Items')).toBeInTheDocument()
  })

  it('should display total price', () => {
    render(<CartSummary items={mockItems} total={37.48} onCheckout={mockOnCheckout} />)
    
    expect(screen.getByText('Total: 37.48 PKR')).toBeInTheDocument()
  })

  it('should handle empty cart', () => {
    render(<CartSummary items={[]} total={0} onCheckout={mockOnCheckout} />)
    
    expect(screen.getByText('0 Items')).toBeInTheDocument()
    expect(screen.getByText('Total: 0 PKR')).toBeInTheDocument()
  })

  it('should call onCheckout when checkout button is clicked', () => {
    render(<CartSummary items={mockItems} total={37.48} onCheckout={mockOnCheckout} />)
    
    const checkoutButton = screen.getByText('CHECKOUT')
    fireEvent.click(checkoutButton)
    
    expect(mockOnCheckout).toHaveBeenCalledTimes(1)
  })

  it('should have proper styling classes', () => {
    render(<CartSummary items={mockItems} total={37.48} onCheckout={mockOnCheckout} />)
    
    const container = screen.getByText('3 Items').closest('div')
    expect(container).toHaveClass('bg-[#1a72dd]')
    expect(container).toHaveClass('text-white')
  })
})
