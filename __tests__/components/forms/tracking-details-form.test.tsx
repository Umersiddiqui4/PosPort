import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TrackingDetailsForm from '@/components/tracking-details-form'
import { useProductTrackingDetails } from '@/hooks/use-product-tracking-details'

// Mock the useProductTrackingDetails hook
jest.mock('@/hooks/use-product-tracking-details', () => ({
  useProductTrackingDetails: jest.fn(),
}))

describe('TrackingDetailsForm', () => {
  const mockTrackingDetails = {
    id: 'tracking-1',
    barCode: '1234567890123',
    sku: 'PROD-001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  }

  const mockCreateTrackingDetails = {
    mutateAsync: jest.fn(),
  }

  const mockUpdateTrackingDetails = {
    mutateAsync: jest.fn(),
  }

  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useProductTrackingDetails as jest.Mock).mockReturnValue({
      createTrackingDetails: mockCreateTrackingDetails,
      updateTrackingDetails: mockUpdateTrackingDetails,
    })
  })

  it('should render the tracking details form for creating new details', () => {
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    expect(screen.getByText('Add Tracking Details')).toBeInTheDocument()
    expect(screen.getByLabelText('Barcode *')).toBeInTheDocument()
    expect(screen.getByLabelText('SKU *')).toBeInTheDocument()
    expect(screen.getByText('Enter the product barcode (numeric)')).toBeInTheDocument()
    expect(screen.getByText('Enter the Stock Keeping Unit (SKU) code')).toBeInTheDocument()
    expect(screen.getByText('Create')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('should render the tracking details form for editing existing details', () => {
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        trackingDetails={mockTrackingDetails}
        mode="edit"
      />
    )
    
    expect(screen.getByText('Edit Tracking Details')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1234567890123')).toBeInTheDocument()
    expect(screen.getByDisplayValue('PROD-001')).toBeInTheDocument()
    expect(screen.getByText('Update')).toBeInTheDocument()
  })

  it('should populate form with existing tracking details when editing', () => {
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        trackingDetails={mockTrackingDetails}
        mode="edit"
      />
    )
    
    expect(screen.getByDisplayValue('1234567890123')).toBeInTheDocument()
    expect(screen.getByDisplayValue('PROD-001')).toBeInTheDocument()
  })

  it('should reset form when switching between create and edit modes', () => {
    const { rerender } = render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        trackingDetails={mockTrackingDetails}
        mode="edit"
      />
    )
    
    expect(screen.getByDisplayValue('1234567890123')).toBeInTheDocument()
    
    // Switch to create mode
    rerender(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    const emptyElements = screen.getAllByDisplayValue('')
    expect(emptyElements.length).toBeGreaterThan(0)
    expect(screen.getByText('Create')).toBeInTheDocument()
  })

  it('should handle form input changes', () => {
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    const barcodeInput = screen.getByLabelText('Barcode *')
    const skuInput = screen.getByLabelText('SKU *')
    
    fireEvent.change(barcodeInput, { target: { value: '9876543210987' } })
    fireEvent.change(skuInput, { target: { value: 'PROD-002' } })
    
    expect(barcodeInput).toHaveValue('9876543210987')
    expect(skuInput).toHaveValue('PROD-002')
  })

  it('should handle form submission for creating new tracking details', async () => {
    mockCreateTrackingDetails.mutateAsync.mockResolvedValue({ data: { id: 'new-tracking-1' } })
    
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText('Barcode *'), { target: { value: '9876543210987' } })
    fireEvent.change(screen.getByLabelText('SKU *'), { target: { value: 'PROD-002' } })
    
    // Submit form
    fireEvent.click(screen.getByText('Create'))
    
    await waitFor(() => {
      expect(mockCreateTrackingDetails.mutateAsync).toHaveBeenCalledWith({
        productId: 'prod-1',
        barCode: '9876543210987',
        sku: 'PROD-002',
      })
    })
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should handle form submission for updating existing tracking details', async () => {
    mockUpdateTrackingDetails.mutateAsync.mockResolvedValue({ data: { id: 'tracking-1' } })
    
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        trackingDetails={mockTrackingDetails}
        mode="edit"
      />
    )
    
    // Update fields
    fireEvent.change(screen.getByLabelText('Barcode *'), { target: { value: '1111111111111' } })
    fireEvent.change(screen.getByLabelText('SKU *'), { target: { value: 'PROD-003' } })
    
    // Submit form
    fireEvent.click(screen.getByText('Update'))
    
    await waitFor(() => {
      expect(mockUpdateTrackingDetails.mutateAsync).toHaveBeenCalledWith({
        id: 'tracking-1',
        data: {
          barCode: '1111111111111',
          sku: 'PROD-003',
        },
      })
    })
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should handle form submission errors', async () => {
    mockCreateTrackingDetails.mutateAsync.mockRejectedValue(new Error('Network error'))
    
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText('Barcode *'), { target: { value: '9876543210987' } })
    fireEvent.change(screen.getByLabelText('SKU *'), { target: { value: 'PROD-002' } })
    
    // Submit form
    fireEvent.click(screen.getByText('Create'))
    
    await waitFor(() => {
      expect(mockCreateTrackingDetails.mutateAsync).toHaveBeenCalled()
    })
    
    // Form should not close on error
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('should show loading state during submission', async () => {
    mockCreateTrackingDetails.mutateAsync.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText('Barcode *'), { target: { value: '9876543210987' } })
    fireEvent.change(screen.getByLabelText('SKU *'), { target: { value: 'PROD-002' } })
    
    // Submit form
    fireEvent.click(screen.getByText('Create'))
    
    expect(screen.getByText('Creating...')).toBeInTheDocument()
    expect(screen.getByText('Creating...')).toBeDisabled()
    expect(screen.getByText('Cancel')).toBeDisabled()
  })

  it('should handle cancel action', () => {
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    fireEvent.click(screen.getByText('Cancel'))
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should prevent closing during submission', () => {
    mockCreateTrackingDetails.mutateAsync.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText('Barcode *'), { target: { value: '9876543210987' } })
    fireEvent.change(screen.getByLabelText('SKU *'), { target: { value: 'PROD-002' } })
    
    // Submit form
    fireEvent.click(screen.getByText('Create'))
    
    // Try to close during submission
    fireEvent.click(screen.getByText('Cancel'))
    
    // Should not close during submission
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('should validate required fields', async () => {
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    // Try to submit without filling required fields
    fireEvent.click(screen.getByText('Create'))
    
    // Form should not submit due to HTML5 validation
    expect(mockCreateTrackingDetails.mutateAsync).not.toHaveBeenCalled()
  })

  it('should handle different barcode formats', () => {
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    const barcodeInput = screen.getByLabelText('Barcode *')
    
    // Test different barcode formats
    const testCases = [
      '1234567890123', // 13 digits
      '123456789012',  // 12 digits
      '12345678901',   // 11 digits
      '1234567890',    // 10 digits
      '123456789',     // 9 digits
    ]
    
    testCases.forEach(testCase => {
      fireEvent.change(barcodeInput, { target: { value: testCase } })
      expect(barcodeInput).toHaveValue(testCase)
    })
  })

  it('should handle different SKU formats', () => {
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    const skuInput = screen.getByLabelText('SKU *')
    
    // Test different SKU formats
    const testCases = [
      'PROD-001',
      'SKU123',
      'ITEM-ABC-123',
      'PRODUCT_001',
      'SKU-2024-001',
    ]
    
    testCases.forEach(testCase => {
      fireEvent.change(skuInput, { target: { value: testCase } })
      expect(skuInput).toHaveValue(testCase)
    })
  })

  it('should handle empty tracking details gracefully', () => {
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        trackingDetails={null}
        mode="edit"
      />
    )
    
    // Should show edit mode even when trackingDetails is null
    expect(screen.getByText('Edit Tracking Details')).toBeInTheDocument()
    const emptyElements = screen.getAllByDisplayValue('')
    expect(emptyElements.length).toBeGreaterThan(0)
  })

  it('should handle tracking details with missing barcode', () => {
    const mockTrackingDetailsWithoutBarcode = {
      ...mockTrackingDetails,
      barCode: null,
    }
    
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        trackingDetails={mockTrackingDetailsWithoutBarcode}
        mode="edit"
      />
    )
    
    expect(screen.getByDisplayValue('')).toBeInTheDocument()
  })

  it('should handle tracking details with missing SKU', () => {
    const mockTrackingDetailsWithoutSku = {
      ...mockTrackingDetails,
      sku: null,
    }
    
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        trackingDetails={mockTrackingDetailsWithoutSku}
        mode="edit"
      />
    )
    
    expect(screen.getByDisplayValue('')).toBeInTheDocument()
  })

  it('should not render when isOpen is false', () => {
    render(
      <TrackingDetailsForm
        isOpen={false}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    expect(screen.queryByText('Add Tracking Details')).not.toBeInTheDocument()
  })

  it('should handle special characters in barcode and SKU', () => {
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    const barcodeInput = screen.getByLabelText('Barcode *')
    const skuInput = screen.getByLabelText('SKU *')
    
    // Test special characters
    fireEvent.change(barcodeInput, { target: { value: '123-456-789' } })
    fireEvent.change(skuInput, { target: { value: 'PROD@001#2024' } })
    
    expect(barcodeInput).toHaveValue('123-456-789')
    expect(skuInput).toHaveValue('PROD@001#2024')
  })

  it('should handle long barcode and SKU values', () => {
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    const barcodeInput = screen.getByLabelText('Barcode *')
    const skuInput = screen.getByLabelText('SKU *')
    
    // Test long values
    const longBarcode = '123456789012345678901234567890'
    const longSku = 'VERY-LONG-SKU-CODE-WITH-MANY-CHARACTERS-2024'
    
    fireEvent.change(barcodeInput, { target: { value: longBarcode } })
    fireEvent.change(skuInput, { target: { value: longSku } })
    
    expect(barcodeInput).toHaveValue(longBarcode)
    expect(skuInput).toHaveValue(longSku)
  })

  it('should handle form reset when dialog opens/closes', () => {
    const { rerender } = render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    // Fill some fields
    fireEvent.change(screen.getByLabelText('Barcode *'), { target: { value: '9876543210987' } })
    fireEvent.change(screen.getByLabelText('SKU *'), { target: { value: 'PROD-002' } })
    
    // Close dialog
    rerender(
      <TrackingDetailsForm
        isOpen={false}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    // Reopen dialog
    rerender(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    // Form should be reset
    const emptyElements = screen.getAllByDisplayValue('')
    expect(emptyElements.length).toBeGreaterThan(0)
  })

  it('should handle whitespace in input values', () => {
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    const barcodeInput = screen.getByLabelText('Barcode *')
    const skuInput = screen.getByLabelText('SKU *')
    
    // Test with leading/trailing whitespace
    fireEvent.change(barcodeInput, { target: { value: '  1234567890123  ' } })
    fireEvent.change(skuInput, { target: { value: '  PROD-001  ' } })
    
    expect(barcodeInput).toHaveValue('  1234567890123  ')
    expect(skuInput).toHaveValue('  PROD-001  ')
  })

  it('should handle numeric and alphanumeric values', () => {
    render(
      <TrackingDetailsForm
        isOpen={true}
        onClose={mockOnClose}
        productId="prod-1"
        mode="create"
      />
    )
    
    const barcodeInput = screen.getByLabelText('Barcode *')
    const skuInput = screen.getByLabelText('SKU *')
    
    // Test numeric barcode
    fireEvent.change(barcodeInput, { target: { value: '1234567890123' } })
    expect(barcodeInput).toHaveValue('1234567890123')
    
    // Test alphanumeric SKU
    fireEvent.change(skuInput, { target: { value: 'PROD123ABC' } })
    expect(skuInput).toHaveValue('PROD123ABC')
  })
})
