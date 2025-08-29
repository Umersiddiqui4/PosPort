// Mock getValidCategory function first
jest.mock('@/lib/Api/uploadAttachment', () => ({
  getValidCategory: jest.fn(() => 'product'),
}))

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import ProductForm from '@/components/product-form'
import { useProducts } from '@/hooks/use-products'
import { useUserDataStore } from '@/lib/store'
import { useCatalogContext } from '@/lib/contexts/CatalogContext'
import { useProductById } from '@/hooks/use-product-by-id'
import { useAttachments } from '@/hooks/use-attachments'
import { useToast } from '@/hooks/use-toast'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))

// Mock hooks
jest.mock('@/hooks/use-products', () => ({
  useProducts: jest.fn(),
}))

jest.mock('@/lib/store', () => ({
  useUserDataStore: jest.fn(),
}))

jest.mock('@/lib/contexts/CatalogContext', () => ({
  useCatalogContext: jest.fn(),
}))

jest.mock('@/hooks/use-product-by-id', () => ({
  useProductById: jest.fn(),
}))

jest.mock('@/hooks/use-attachments', () => ({
  useAttachments: jest.fn(),
}))

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}))

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}))

// Mock FileUpload component
jest.mock('@/components/ui/file-upload', () => {
  return function MockFileUpload({ onFileSelect, onFileRemove, selectedFile, onValidationError }: any) {
    return (
      <div data-testid="file-upload">
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFileSelect(file)
          }}
          data-testid="file-input"
        />
        {selectedFile && (
          <button onClick={() => onFileRemove()} data-testid="remove-file">
            Remove {selectedFile.name}
          </button>
        )}
        <button onClick={() => onValidationError('File too large')} data-testid="validation-error">
          Trigger Error
        </button>
      </div>
    )
  }
})

describe('ProductForm', () => {
  const mockUseParams = useParams as jest.MockedFunction<typeof useParams>
  const mockUseProducts = useProducts as jest.MockedFunction<typeof useProducts>
  const mockUseUserDataStore = useUserDataStore as jest.MockedFunction<typeof useUserDataStore>
  const mockUseCatalogContext = useCatalogContext as jest.MockedFunction<typeof useCatalogContext>
  const mockUseProductById = useProductById as jest.MockedFunction<typeof useProductById>
  const mockUseAttachments = useAttachments as jest.MockedFunction<typeof useAttachments>
  const mockUseToast = useToast as jest.MockedFunction<typeof useToast>
  const mockUseQueryClient = useQueryClient as jest.MockedFunction<typeof useQueryClient>

  const mockCreateProduct = jest.fn()
  const mockUpdateProduct = jest.fn()
  const mockUploadAttachment = jest.fn()
  const mockDeleteAttachment = jest.fn()
  const mockToast = jest.fn()
  const mockQueryClient = {
    invalidateQueries: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mocks
    mockUseParams.mockReturnValue({ Id: '1' })
    mockUseProducts.mockReturnValue({
      createProduct: mockCreateProduct,
      updateProduct: mockUpdateProduct,
    })
    mockUseUserDataStore.mockReturnValue({
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'COMPANY_OWNER',
        locationId: 'loc-1',
      },
    })
    mockUseCatalogContext.mockReturnValue({
      selectedCatalog: { id: 'cat-1', name: 'Test Catalog' },
      catalogData: { id: 'cat-1', name: 'Test Catalog' },
      catalogLoading: false,
      locationId: 'loc-1',
      selectedCategoryId: 'cat-1',
      categories: [],
      products: [],
      filteredProducts: [],
      isLoading: false,
      updateCatalog: jest.fn(),
      updateCategory: jest.fn(),
      resetCatalog: jest.fn(),
    })
    mockUseProductById.mockReturnValue({
      data: null,
      isLoading: false,
    })
    mockUseAttachments.mockReturnValue({
      uploadAttachment: mockUploadAttachment,
      deleteAttachment: mockDeleteAttachment,
    })
    mockUseToast.mockReturnValue({
      toast: mockToast,
    })
    mockUseQueryClient.mockReturnValue(mockQueryClient)
  })

  it('should render create form', () => {
    render(<ProductForm onSuccess={jest.fn()} onCancel={jest.fn()} selectedCategoryId="cat-1" />)
    
    expect(screen.getByText('Create Product')).toBeInTheDocument()
    expect(screen.getByLabelText('Product Name *')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Retail Price *')).toBeInTheDocument()
    expect(screen.getByLabelText('Cost')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
  })

  it('should render edit form with product data', () => {
    const mockProduct = {
      id: 'prod-1',
      productName: 'Test Product',
      description: 'Test Description',
      retailPrice: 10.99,
      cost: 5.99,
      status: 'active',
    }

    mockUseProductById.mockReturnValue({
      data: mockProduct,
      isLoading: false,
    })

    render(<ProductForm product={mockProduct} onSuccess={jest.fn()} onCancel={jest.fn()} selectedCategoryId="cat-1" />)
    
    expect(screen.getByText('Edit Product')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument()
    expect(screen.getByDisplayValue('10.99')).toBeInTheDocument()
    expect(screen.getByDisplayValue('5.99')).toBeInTheDocument()
  })

  it('should show loading state when product is loading', () => {
    mockUseProductById.mockReturnValue({
      data: null,
      isLoading: true,
    })

    render(<ProductForm onSuccess={jest.fn()} onCancel={jest.fn()} selectedCategoryId="cat-1" />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should handle form submission for creating product', async () => {
    mockCreateProduct.mockResolvedValue({ success: true })

    render(<ProductForm onSuccess={jest.fn()} onCancel={jest.fn()} selectedCategoryId="cat-1" />)
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Product Name *'), { target: { value: 'New Product' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New Description' } })
    fireEvent.change(screen.getByLabelText('Retail Price *'), { target: { value: '15.99' } })
    
    // Submit form
    fireEvent.click(screen.getByText('Create Product'))
    
    await waitFor(() => {
      expect(mockCreateProduct).toHaveBeenCalledWith({
        productName: 'New Product',
        description: 'New Description',
        retailPrice: 15.99,
        cost: 0,
        uom: 'Piece',
        image: '',
        status: 'active',
        categoryId: 'cat-1',
        locationId: 'loc-1',
      })
    })
  })

  it('should handle form submission for updating product', async () => {
    const mockProduct = {
      id: 'prod-1',
      productName: 'Test Product',
      description: 'Test Description',
      retailPrice: 10.99,
      cost: 5.99,
      status: 'active',
    }

    mockUseProductById.mockReturnValue({
      data: mockProduct,
      isLoading: false,
    })
    mockUpdateProduct.mockResolvedValue({ success: true })

    render(<ProductForm product={mockProduct} onSuccess={jest.fn()} onCancel={jest.fn()} selectedCategoryId="cat-1" />)
    
    // Update form
    fireEvent.change(screen.getByLabelText('Product Name *'), { target: { value: 'Updated Product' } })
    
    // Submit form
    fireEvent.click(screen.getByText('Update Product'))
    
    await waitFor(() => {
      expect(mockUpdateProduct).toHaveBeenCalledWith('prod-1', {
        productName: 'Updated Product',
        description: 'Test Description',
        retailPrice: 10.99,
        cost: 5.99,
        uom: 'Piece',
        image: '',
        status: 'active',
        categoryId: 'cat-1',
        locationId: 'loc-1',
      })
    })
  })

  it('should handle form cancellation', () => {
    const mockOnCancel = jest.fn()
    
    render(<ProductForm onSuccess={jest.fn()} onCancel={mockOnCancel} selectedCategoryId="cat-1" />)
    
    fireEvent.click(screen.getByText('Cancel'))
    
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('should show error message on submission failure', async () => {
    mockCreateProduct.mockRejectedValue(new Error('Failed to create product'))

    render(<ProductForm onSuccess={jest.fn()} onCancel={jest.fn()} selectedCategoryId="cat-1" />)
    
    // Fill and submit form
    fireEvent.change(screen.getByLabelText('Product Name *'), { target: { value: 'New Product' } })
    fireEvent.click(screen.getByText('Create Product'))
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive',
      })
    })
  })

  it('should handle image upload', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
    mockUploadAttachment.mockResolvedValue({ id: 'att-1', url: 'test-url' })

    render(<ProductForm onSuccess={jest.fn()} onCancel={jest.fn()} selectedCategoryId="cat-1" />)
    
    const fileInput = screen.getByTestId('file-input')
    fireEvent.change(fileInput, { target: { files: [mockFile] } })
    
    await waitFor(() => {
      expect(screen.getByText('Remove test.png')).toBeInTheDocument()
    })
  })

  it('should handle image removal', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' })

    render(<ProductForm onSuccess={jest.fn()} onCancel={jest.fn()} selectedCategoryId="cat-1" />)
    
    // Upload file
    const fileInput = screen.getByTestId('file-input')
    fireEvent.change(fileInput, { target: { files: [mockFile] } })
    
    // Remove file
    const removeButton = screen.getByText('Remove test.png')
    fireEvent.click(removeButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Remove test.png')).not.toBeInTheDocument()
    })
  })

  it('should validate required fields', async () => {
    render(<ProductForm onSuccess={jest.fn()} onCancel={jest.fn()} selectedCategoryId="cat-1" />)
    
    // Try to submit without filling required fields
    fireEvent.click(screen.getByText('Create Product'))
    
    // Form should not submit due to validation
    expect(mockCreateProduct).not.toHaveBeenCalled()
  })

  it('should show existing image when editing', () => {
    const mockProduct = {
      id: 'prod-1',
      productName: 'Test Product',
      attachments: [{ id: 'att-1', url: 'test-image.jpg' }],
    }

    mockUseProductById.mockReturnValue({
      data: mockProduct,
      isLoading: false,
    })

    render(<ProductForm product={mockProduct} onSuccess={jest.fn()} onCancel={jest.fn()} selectedCategoryId="cat-1" />)
    
    // Should show existing image
    expect(screen.getByAltText('Test Product')).toBeInTheDocument()
  })

  it('should handle missing location information', () => {
    mockUseCatalogContext.mockReturnValue({
      selectedCatalog: { id: 'cat-1', name: 'Test Catalog' },
      catalogData: { id: 'cat-1', name: 'Test Catalog' },
      catalogLoading: false,
      locationId: null, // No location ID
      selectedCategoryId: 'cat-1',
      categories: [],
      products: [],
      filteredProducts: [],
      isLoading: false,
      updateCatalog: jest.fn(),
      updateCategory: jest.fn(),
      resetCatalog: jest.fn(),
    })

    render(<ProductForm onSuccess={jest.fn()} onCancel={jest.fn()} selectedCategoryId="cat-1" />)
    
    // Should show warning about missing location
    expect(screen.getByText(/location/i)).toBeInTheDocument()
  })
})
