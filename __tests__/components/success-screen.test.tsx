import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SuccessScreen from '@/components/success-screen'

describe('SuccessScreen', () => {
  const mockOnPrintReceipt = jest.fn()
  const mockOnNextOrder = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render success screen with default props', () => {
    render(<SuccessScreen onPrintReceipt={mockOnPrintReceipt} onNextOrder={mockOnNextOrder} />)
    
    expect(screen.getByText('Successful Transaction!')).toBeInTheDocument()
  })

  it('should render payment method information', () => {
    render(<SuccessScreen onPrintReceipt={mockOnPrintReceipt} onNextOrder={mockOnNextOrder} />)
    
    expect(screen.getByText('Method Payment: Cash')).toBeInTheDocument()
    expect(screen.getByText('Change Customer: 300 PKR')).toBeInTheDocument()
  })

  it('should render action buttons', () => {
    render(<SuccessScreen onPrintReceipt={mockOnPrintReceipt} onNextOrder={mockOnNextOrder} />)
    
    expect(screen.getByText('PRINT RECEIPT')).toBeInTheDocument()
    expect(screen.getByText('NEXT ORDER')).toBeInTheDocument()
  })

  it('should call onPrintReceipt when print button is clicked', () => {
    render(<SuccessScreen onPrintReceipt={mockOnPrintReceipt} onNextOrder={mockOnNextOrder} />)
    
    const printButton = screen.getByText('PRINT RECEIPT')
    fireEvent.click(printButton)
    
    expect(mockOnPrintReceipt).toHaveBeenCalledTimes(1)
  })

  it('should call onNextOrder when next order button is clicked', () => {
    render(<SuccessScreen onPrintReceipt={mockOnPrintReceipt} onNextOrder={mockOnNextOrder} />)
    
    const nextOrderButton = screen.getByText('NEXT ORDER')
    fireEvent.click(nextOrderButton)
    
    expect(mockOnNextOrder).toHaveBeenCalledTimes(1)
  })

  it('should have proper styling classes', () => {
    render(<SuccessScreen onPrintReceipt={mockOnPrintReceipt} onNextOrder={mockOnNextOrder} />)
    
    const container = screen.getByText('Successful Transaction!').closest('div')
    expect(container).toHaveClass('text-center')
    expect(container).toHaveClass('mb-6')
  })
})
