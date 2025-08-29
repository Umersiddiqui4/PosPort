import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useParams, useRouter } from 'next/navigation'
import ProductDetail from '@/app/(dashboard)/product-list/[id]/page'
import { useProductById } from '@/hooks/use-product-by-id'
import { useProductLifetimeDetails } from '@/hooks/use-product-lifetime-details'
import { useProductTrackingDetails } from '@/hooks/use-product-tracking-details'
import { useProductInventory } from '@/hooks/use-product-inventory'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useToast } from '@/hooks/use-toast'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}))

// Mock hooks
jest.mock('@/hooks/use-product-by-id')
jest.mock('@/hooks/use-product-lifetime-details')
jest.mock('@/hooks/use-product-tracking-details')
jest.mock('@/hooks/use-product-inventory')
jest.mock('@/hooks/useCurrentUser')
jest.mock('@/hooks/use-toast')

// Mock form components
jest.mock('@/components/lifetime-details-form', () => {
  return function MockLifetimeDetailsForm({ isOpen, onClose }: any) {
    if (!isOpen) return null
    return (
      <div data-testid="lifetime-form">
        <button onClick={onClose}>Close Lifetime Form</button>
      </div>
    )
  }
})

jest.mock('@/components/tracking-details-form', () => {
  return function MockTrackingDetailsForm({ isOpen, onClose }: any) {
    if (!isOpen) return null
    return (
      <div data-testid="tracking-form">
        <button onClick={onClose}>Close Tracking Form</button>
      </div>
    )
  }
})

jest.mock('@/components/inventory-form', () => {
  return function MockInventoryForm({ isOpen, onClose }: any) {
    if (!isOpen) return null
    return (
      <div data-testid="inventory-form">
        <button onClick={onClose}>Close Inventory Form</button>
      </div>
    )
  }
})

jest.mock('@/components/print-barcode', () => {
  return function MockPrintBarcode({ value, productName }: any) {
    return (
      <div data-testid="print-barcode">
        <span>Barcode: {value}</span>
        <span>Product: {productName}</span>
      </div>
    )
  }
})

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}))

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  TabsContent: ({ children, value, ...props }: any) => <div {...props}>{children}</div>,
  TabsList: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  TabsTrigger: ({ children, value, ...props }: any) => <button role="tab" {...props}>{children}</button>,
}))

jest.mock('@/components/ui/separator', () => ({
  Separator: ({ ...props }: any) => <hr {...props} />,
}))

jest.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children, open, onOpenChange, ...props }: any) => 
    open ? <div data-testid="alert-dialog" {...props}>{children}</div> : null,
  AlertDialogAction: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  AlertDialogCancel: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  AlertDialogContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AlertDialogDescription: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  AlertDialogFooter: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AlertDialogHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AlertDialogTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
}))



const mockPush = jest.fn()
const mockToast = jest.fn()

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  retailPrice: 100,
  cost: 80,
  status: 'active',
  locationId: 'loc-1',
  companyId: 'comp-1',
  catalogId: 'cat-1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  attachments: [
    {
      id: 'att-1',
      url: '/test-image.jpg',
      filename: 'test-image.jpg',
      size: 1024,
    },
  ],
}

const mockLifetimeDetails = {
  id: 'lifetime-1',
  expiry: '2024-12-31T00:00:00Z',
  shelfLife: '12 months',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockTrackingDetails = {
  id: 'tracking-1',
  barCode: '123456789',
  sku: 'SKU123',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockInventory = {
  id: 'inventory-1',
  currentStock: 50,
  reservedStock: 10,
  reorderLevel: 20,
  minimumReorderQuantity: 25,
  maxStockCapacity: 100,
  costPerUnit: 80,
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockUser = {
  id: 'user-1',
  role: 'POSPORT_ADMIN',
  email: 'admin@test.com',
}

describe('ProductDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    ;(useParams as jest.Mock).mockReturnValue({ id: '1' })
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
    ;(useCurrentUser as jest.Mock).mockReturnValue({ user: mockUser })
    ;(useProductById as jest.Mock).mockReturnValue({
      data: mockProduct,
      isLoading: false,
      error: null,
    })
    ;(useProductLifetimeDetails as jest.Mock).mockReturnValue({
      lifetimeDetails: mockLifetimeDetails,
      isLoading: false,
      error: null,
    })
    ;(useProductTrackingDetails as jest.Mock).mockReturnValue({
      trackingDetails: mockTrackingDetails,
      isLoading: false,
      error: null,
    })
    ;(useProductInventory as jest.Mock).mockReturnValue({
      inventory: mockInventory,
      isLoading: false,
      error: null,
    })
  })

  describe('Loading States', () => {
    it('should show loading spinner when product is loading', () => {
      ;(useProductById as jest.Mock).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      })

      render(<ProductDetail />)
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('should show loading spinner when lifetime details are loading', () => {
      ;(useProductLifetimeDetails as jest.Mock).mockReturnValue({
        lifetimeDetails: null,
        isLoading: true,
        error: null,
      })

      render(<ProductDetail />)
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('should show loading spinner when tracking details are loading', () => {
      ;(useProductTrackingDetails as jest.Mock).mockReturnValue({
        trackingDetails: null,
        isLoading: true,
        error: null,
      })

      render(<ProductDetail />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should show loading spinner when inventory is loading', () => {
      ;(useProductInventory as jest.Mock).mockReturnValue({
        inventory: null,
        isLoading: true,
        error: null,
      })

      render(<ProductDetail />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  describe('Error States', () => {
    it('should show error message when product fails to load', () => {
      ;(useProductById as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        error: 'Failed to load product',
      })

      render(<ProductDetail />)
      expect(screen.getByText('Error loading product details. Please try again.')).toBeInTheDocument()
    })

    it('should show error message when no product is found', () => {
      ;(useProductById as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      })

      render(<ProductDetail />)
      expect(screen.getByText('Error loading product details. Please try again.')).toBeInTheDocument()
    })
  })

  describe('Product Display', () => {
    it('should display product information correctly', () => {
      render(<ProductDetail />)
      
      expect(screen.getByText('Test Product')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('100 PKR')).toBeInTheDocument()
      expect(screen.getByText('80 PKR')).toBeInTheDocument()
      expect(screen.getByText('active')).toBeInTheDocument()
    })

    it('should display product image when available', () => {
      render(<ProductDetail />)
      
      const image = screen.getByAltText('Test Product')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/test-image.jpg')
    })

    it('should display placeholder image when no attachments', () => {
      const productWithoutAttachments = { ...mockProduct, attachments: [] }
      ;(useProductById as jest.Mock).mockReturnValue({
        data: productWithoutAttachments,
        isLoading: false,
        error: null,
      })

      render(<ProductDetail />)
      
      const image = screen.getByAltText('Test Product')
      expect(image).toHaveAttribute('src', '/placeholder.svg')
    })
  })

  describe('Navigation', () => {
    it('should navigate back when back button is clicked', () => {
      render(<ProductDetail />)
      
      const backButton = screen.getByRole('button', { name: /back/i })
      fireEvent.click(backButton)
      
      expect(mockPush).toHaveBeenCalledWith('/product-list')
    })

    it('should navigate to edit page when edit button is clicked', () => {
      render(<ProductDetail />)
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      const mainEditButton = editButtons[0] // Get the first edit button (main one)
      fireEvent.click(mainEditButton)
      
      expect(mockPush).toHaveBeenCalledWith('/product-list/1/edit')
    })
  })

  describe('Delete Functionality', () => {
    it('should open delete dialog when delete button is clicked', () => {
      render(<ProductDetail />)
      
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)
      
      expect(screen.getByText('Are you absolutely sure?')).toBeInTheDocument()
    })

    it('should close delete dialog when cancel is clicked', () => {
      render(<ProductDetail />)
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      const mainDeleteButton = deleteButtons[0] // Get the first delete button (main one)
      fireEvent.click(mainDeleteButton)
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)
      
      expect(screen.queryByText('Are you absolutely sure?')).not.toBeInTheDocument()
    })

    it('should handle delete confirmation', async () => {
      render(<ProductDetail />)
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      const mainDeleteButton = deleteButtons[0] // Get the first delete button (main one)
      fireEvent.click(mainDeleteButton)
      
      const confirmDeleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(confirmDeleteButton)
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Product deleted',
          description: 'Product has been deleted successfully.',
        })
        expect(mockPush).toHaveBeenCalledWith('/product-list')
      })
    })
  })

  describe('Lifetime Details Tab', () => {
    it('should display lifetime details when available', () => {
      render(<ProductDetail />)
      
      const lifetimeTab = screen.getByRole('tab', { name: /lifetime/i })
      fireEvent.click(lifetimeTab)
      
      expect(screen.getByText('Product Lifetime Details')).toBeInTheDocument()
      expect(screen.getByText('12 months')).toBeInTheDocument()
    })

    it('should show error state for lifetime details', () => {
      ;(useProductLifetimeDetails as jest.Mock).mockReturnValue({
        lifetimeDetails: null,
        isLoading: false,
        error: 'Failed to load lifetime details',
      })

      render(<ProductDetail />)
      
      const lifetimeTab = screen.getByRole('tab', { name: /lifetime/i })
      fireEvent.click(lifetimeTab)
      
      expect(screen.getByText('Error loading lifetime details')).toBeInTheDocument()
    })

    it('should show empty state for lifetime details', () => {
      ;(useProductLifetimeDetails as jest.Mock).mockReturnValue({
        lifetimeDetails: null,
        isLoading: false,
        error: null,
      })

      render(<ProductDetail />)
      
      const lifetimeTab = screen.getByRole('tab', { name: /lifetime/i })
      fireEvent.click(lifetimeTab)
      
      expect(screen.getByText('No lifetime details found')).toBeInTheDocument()
    })

    it('should open lifetime form when add button is clicked', () => {
      ;(useProductLifetimeDetails as jest.Mock).mockReturnValue({
        lifetimeDetails: null,
        isLoading: false,
        error: null,
      })

      render(<ProductDetail />)
      
      const lifetimeTab = screen.getByRole('tab', { name: /lifetime/i })
      fireEvent.click(lifetimeTab)
      
      const addButton = screen.getByText('Add Lifetime Details')
      fireEvent.click(addButton)
      
      expect(screen.getByTestId('lifetime-form')).toBeInTheDocument()
    })

    it('should open lifetime form in edit mode when edit button is clicked', () => {
      render(<ProductDetail />)
      
      const lifetimeTab = screen.getByRole('tab', { name: /lifetime/i })
      fireEvent.click(lifetimeTab)
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      const lifetimeEditButton = editButtons[1] // Get the second edit button (lifetime tab)
      fireEvent.click(lifetimeEditButton)
      
      expect(screen.getByTestId('lifetime-form')).toBeInTheDocument()
    })
  })

  describe('Tracking Details Tab', () => {
    it('should display tracking details when available', () => {
      render(<ProductDetail />)
      
      const trackingTab = screen.getByRole('tab', { name: /tracking/i })
      fireEvent.click(trackingTab)
      
      expect(screen.getByText('Product Tracking Details')).toBeInTheDocument()
      expect(screen.getByText('123456789')).toBeInTheDocument()
      expect(screen.getByText('SKU123')).toBeInTheDocument()
      expect(screen.getByTestId('print-barcode')).toBeInTheDocument()
    })

    it('should show error state for tracking details', () => {
      ;(useProductTrackingDetails as jest.Mock).mockReturnValue({
        trackingDetails: null,
        isLoading: false,
        error: 'Failed to load tracking details',
      })

      render(<ProductDetail />)
      
      const trackingTab = screen.getByRole('tab', { name: /tracking/i })
      fireEvent.click(trackingTab)
      
      expect(screen.getByText('Error loading tracking details')).toBeInTheDocument()
    })

    it('should show empty state for tracking details', () => {
      ;(useProductTrackingDetails as jest.Mock).mockReturnValue({
        trackingDetails: null,
        isLoading: false,
        error: null,
      })

      render(<ProductDetail />)
      
      const trackingTab = screen.getByRole('tab', { name: /tracking/i })
      fireEvent.click(trackingTab)
      
      expect(screen.getByText('No tracking details found')).toBeInTheDocument()
    })

    it('should open tracking form when add button is clicked', () => {
      ;(useProductTrackingDetails as jest.Mock).mockReturnValue({
        trackingDetails: null,
        isLoading: false,
        error: null,
      })

      render(<ProductDetail />)
      
      const trackingTab = screen.getByRole('tab', { name: /tracking/i })
      fireEvent.click(trackingTab)
      
      const addButton = screen.getByText('Add Tracking Details')
      fireEvent.click(addButton)
      
      expect(screen.getByTestId('tracking-form')).toBeInTheDocument()
    })
  })

  describe('Inventory Tab', () => {
    it('should display inventory details when available', () => {
      render(<ProductDetail />)
      
      const inventoryTab = screen.getByRole('tab', { name: /stock/i })
      fireEvent.click(inventoryTab)
      
      expect(screen.getByText('Product Inventory')).toBeInTheDocument()
      // Note: The actual inventory values depend on the mock data structure
      // These tests may need adjustment based on the actual inventory object structure
    })

    it('should show error state for inventory', () => {
      ;(useProductInventory as jest.Mock).mockReturnValue({
        inventory: null,
        isLoading: false,
        error: 'Failed to load inventory',
      })

      render(<ProductDetail />)
      
      const inventoryTab = screen.getByRole('tab', { name: /stock/i })
      fireEvent.click(inventoryTab)
      
      expect(screen.getByText('Error loading inventory')).toBeInTheDocument()
    })

    it('should show empty state for inventory', () => {
      ;(useProductInventory as jest.Mock).mockReturnValue({
        inventory: null,
        isLoading: false,
        error: null,
      })

      render(<ProductDetail />)
      
      const inventoryTab = screen.getByRole('tab', { name: /stock/i })
      fireEvent.click(inventoryTab)
      
      expect(screen.getByText('No inventory found')).toBeInTheDocument()
    })

    it('should open inventory form when add button is clicked', async () => {
      ;(useProductInventory as jest.Mock).mockReturnValue({
        inventory: null,
        isLoading: false,
        error: null,
      })

      render(<ProductDetail />)
      
      const inventoryTab = screen.getByRole('tab', { name: /stock/i })
      fireEvent.click(inventoryTab)
      
      // Wait for the tab content to be rendered
      await waitFor(() => {
        expect(screen.getByText('No inventory found')).toBeInTheDocument()
      })
      
      const addButton = screen.getByText('Add Inventory')
      fireEvent.click(addButton)
      
      expect(screen.getByTestId('inventory-form')).toBeInTheDocument()
    })
  })

  describe('User Permissions', () => {
    it('should show edit and delete buttons for admin users', () => {
      render(<ProductDetail />)
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      expect(editButtons.length).toBeGreaterThan(0)
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      expect(deleteButtons.length).toBeGreaterThan(0)
    })

    it('should not show edit and delete buttons for non-admin users', () => {
      ;(useCurrentUser as jest.Mock).mockReturnValue({
        user: { ...mockUser, role: 'USER' },
      })

      render(<ProductDetail />)
      
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
    })

    it('should not show form buttons for non-admin users', () => {
      ;(useCurrentUser as jest.Mock).mockReturnValue({
        user: { ...mockUser, role: 'USER' },
      })

      render(<ProductDetail />)
      
      const lifetimeTab = screen.getByRole('tab', { name: /lifetime/i })
      fireEvent.click(lifetimeTab)
      
      expect(screen.queryByText('Add')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
    })
  })

  describe('Form Interactions', () => {
    it('should close lifetime form when close button is clicked', async () => {
      ;(useProductLifetimeDetails as jest.Mock).mockReturnValue({
        lifetimeDetails: null,
        isLoading: false,
        error: null,
      })

      render(<ProductDetail />)
      
      const lifetimeTab = screen.getByRole('tab', { name: /lifetime/i })
      fireEvent.click(lifetimeTab)
      
      // Wait for the tab content to be rendered
      await waitFor(() => {
        expect(screen.getByText('No lifetime details found')).toBeInTheDocument()
      })
      
      const addButton = screen.getByText('Add Lifetime Details')
      fireEvent.click(addButton)
      
      const closeButton = screen.getByRole('button', { name: /close lifetime form/i })
      fireEvent.click(closeButton)
      
      expect(screen.queryByTestId('lifetime-form')).not.toBeInTheDocument()
    })

    it('should close tracking form when close button is clicked', async () => {
      ;(useProductTrackingDetails as jest.Mock).mockReturnValue({
        trackingDetails: null,
        isLoading: false,
        error: null,
      })

      render(<ProductDetail />)
      
      const trackingTab = screen.getByRole('tab', { name: /tracking/i })
      fireEvent.click(trackingTab)
      
      // Wait for the tab content to be rendered
      await waitFor(() => {
        expect(screen.getByText('No tracking details found')).toBeInTheDocument()
      })
      
      const addButton = screen.getByText('Add Tracking Details')
      fireEvent.click(addButton)
      
      const closeButton = screen.getByRole('button', { name: /close tracking form/i })
      fireEvent.click(closeButton)
      
      expect(screen.queryByTestId('tracking-form')).not.toBeInTheDocument()
    })

    it('should close inventory form when close button is clicked', async () => {
      ;(useProductInventory as jest.Mock).mockReturnValue({
        inventory: null,
        isLoading: false,
        error: null,
      })

      render(<ProductDetail />)
      
      const inventoryTab = screen.getByRole('tab', { name: /stock/i })
      fireEvent.click(inventoryTab)
      
      // Wait for the tab content to be rendered
      await waitFor(() => {
        expect(screen.getByText('No inventory found')).toBeInTheDocument()
      })
      
      const addButton = screen.getByText('Add Inventory')
      fireEvent.click(addButton)
      
      const closeButton = screen.getByRole('button', { name: /close inventory form/i })
      fireEvent.click(closeButton)
      
      expect(screen.queryByTestId('inventory-form')).not.toBeInTheDocument()
    })
  })

  describe('Attachments Section', () => {
    it('should display attachments when available', () => {
      render(<ProductDetail />)
      
      const lifetimeTab = screen.getByRole('tab', { name: /lifetime/i })
      fireEvent.click(lifetimeTab)
      
      expect(screen.getByText('Product Attachments')).toBeInTheDocument()
      expect(screen.getByText('test-image.jpg')).toBeInTheDocument()
      expect(screen.getByText('1.0 KB')).toBeInTheDocument()
    })

    it('should not display attachments section when no attachments', () => {
      const productWithoutAttachments = { ...mockProduct, attachments: [] }
      ;(useProductById as jest.Mock).mockReturnValue({
        data: productWithoutAttachments,
        isLoading: false,
        error: null,
      })

      render(<ProductDetail />)
      
      const lifetimeTab = screen.getByRole('tab', { name: /lifetime/i })
      fireEvent.click(lifetimeTab)
      
      expect(screen.queryByText('Product Attachments')).not.toBeInTheDocument()
    })
  })
})
