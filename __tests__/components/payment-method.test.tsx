import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PaymentMethod from '@/components/payment-method'

describe('PaymentMethod', () => {
  const mockOnPaymentSelect = jest.fn()
  const mockOnExactAmount = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render payment method component', () => {
    render(<PaymentMethod totalAmount={1000} onPaymentSelect={mockOnPaymentSelect} onExactAmount={mockOnExactAmount} />)
    
    expect(screen.getByText('Total Bill')).toBeInTheDocument()
  })

  it('should display total amount', () => {
    render(<PaymentMethod totalAmount={1500} onPaymentSelect={mockOnPaymentSelect} onExactAmount={mockOnExactAmount} />)
    
    expect(screen.getByText('1500 PKR')).toBeInTheDocument()
  })

  it('should render different payment options', () => {
    render(<PaymentMethod totalAmount={1000} onPaymentSelect={mockOnPaymentSelect} onExactAmount={mockOnExactAmount} />)
    
    expect(screen.getByText('Cash Payment')).toBeInTheDocument()
    expect(screen.getByText('Card Payment')).toBeInTheDocument()
  })

  it('should call onPaymentSelect when cash payment is clicked', () => {
    render(<PaymentMethod totalAmount={1000} onPaymentSelect={mockOnPaymentSelect} onExactAmount={mockOnExactAmount} />)
    
    const cashButton = screen.getByText('Cash Payment')
    fireEvent.click(cashButton)
    
    expect(mockOnPaymentSelect).toHaveBeenCalledWith('cash')
  })

  it('should call onPaymentSelect when card payment is clicked', () => {
    render(<PaymentMethod totalAmount={1000} onPaymentSelect={mockOnPaymentSelect} onExactAmount={mockOnExactAmount} />)
    
    const cardButton = screen.getByText('Card Payment')
    fireEvent.click(cardButton)
    
    expect(mockOnPaymentSelect).toHaveBeenCalledWith('card')
  })

  it('should call onExactAmount when exact amount button is clicked', () => {
    render(<PaymentMethod totalAmount={1000} onPaymentSelect={mockOnPaymentSelect} onExactAmount={mockOnExactAmount} />)
    
    const exactAmountButton = screen.getByText('EXACT AMOUNT')
    fireEvent.click(exactAmountButton)
    
    expect(mockOnExactAmount).toHaveBeenCalledTimes(1)
  })

  it('should have proper styling classes', () => {
    render(<PaymentMethod totalAmount={1000} onPaymentSelect={mockOnPaymentSelect} onExactAmount={mockOnExactAmount} />)
    
    const container = screen.getByText('Total Bill').closest('div')
    expect(container).toHaveClass('text-center')
    expect(container).toHaveClass('mb-8')
  })
})
