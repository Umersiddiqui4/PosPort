import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import ProductList from '@/app/(dashboard)/product-list/page'
import { useProducts } from '@/hooks/use-products'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock the useProducts hook
jest.mock('@/hooks/use-products', () => ({
  useProducts: jest.fn(),
}))

// Mock the CompactBarcode component
jest.mock('@/components/compact-barcode', () => {
  return function MockCompactBarcode({ value }: { value: string }) {
    return <div data-testid="barcode">{value}</div>
  }
})

const mockPush = jest.fn()

describe('ProductList Page', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Test Product 1',
      description: 'Test description 1',
      status: 'active',
      retailPrice: '100',
      stock: 10,
      attachments: [{ url: '/test-image-1.jpg' }],
    },
    {
      id: '2',
      name: 'Test Product 2',
      description: 'Test description 2',
      status: 'inactive',
      retailPrice: '200',
      stock: 0,
      attachments: [{ url: '/test-image-2.jpg' }],
    },
    {
      id: '3',
      name: 'Another Product',
      description: 'Another description',
      status: 'active',
      retailPrice: '150',
      stock: 5,
      attachments: [],
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(useProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      error: null,
    })
  })

  it('should render the product list page with header', () => {
    render(<ProductList />)
    
    expect(screen.getByText('Product Management')).toBeInTheDocument()
    expect(screen.getByText('Manage and view all your products')).toBeInTheDocument()
    expect(screen.getByText('Add Product')).toBeInTheDocument()
  })

  it('should display statistics cards', () => {
    render(<ProductList />)
    
    expect(screen.getByText('Total Products')).toBeInTheDocument()
    const totalProductsElements = screen.getAllByText('3')
    expect(totalProductsElements.length).toBeGreaterThan(0) // Total products count
    
    expect(screen.getByText('Active Products')).toBeInTheDocument()
    const activeProductsElements = screen.getAllByText('2')
    expect(activeProductsElements.length).toBeGreaterThan(0) // Active products count
    
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument() // Categories count
    
    expect(screen.getByText('In Stock')).toBeInTheDocument()
    const inStockElements = screen.getAllByText('2')
    expect(inStockElements.length).toBeGreaterThan(0) // Products with stock > 0
  })

  it('should display search input and filter dropdown', () => {
    render(<ProductList />)
    
    expect(screen.getByPlaceholderText('Search products by name or description...')).toBeInTheDocument()
    expect(screen.getByText('All Status')).toBeInTheDocument()
  })

  it('should display products in grid view by default', () => {
    render(<ProductList />)
    
    expect(screen.getByText('Test Product 1')).toBeInTheDocument()
    expect(screen.getByText('Test Product 2')).toBeInTheDocument()
    expect(screen.getByText('Another Product')).toBeInTheDocument()
  })

  it('should filter products by search term', () => {
    render(<ProductList />)
    
    const searchInput = screen.getByPlaceholderText('Search products by name or description...')
    
    // Search for "Test"
    fireEvent.change(searchInput, { target: { value: 'Test' } })
    
    expect(screen.getByText('Test Product 1')).toBeInTheDocument()
    expect(screen.getByText('Test Product 2')).toBeInTheDocument()
    expect(screen.queryByText('Another Product')).not.toBeInTheDocument()
    
    // Search for "Another"
    fireEvent.change(searchInput, { target: { value: 'Another' } })
    
    expect(screen.queryByText('Test Product 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument()
    expect(screen.getByText('Another Product')).toBeInTheDocument()
  })

  it('should filter products by status', () => {
    render(<ProductList />)
    
    const statusSelect = screen.getByText('All Status')
    fireEvent.click(statusSelect)
    
    // Select "Active" status
    const activeOption = screen.getByText('Active')
    fireEvent.click(activeOption)
    
    expect(screen.getByText('Test Product 1')).toBeInTheDocument()
    expect(screen.getByText('Another Product')).toBeInTheDocument()
    expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument() // inactive product
  })

  it('should navigate to product detail when product is clicked', () => {
    render(<ProductList />)
    
    const productCard = screen.getByText('Test Product 1').closest('[class*="cursor-pointer"]')
    fireEvent.click(productCard!)
    
    expect(mockPush).toHaveBeenCalledWith('/product-list/1')
  })

  it('should navigate to create product page when add button is clicked', () => {
    render(<ProductList />)
    
    const addButton = screen.getByText('Add Product')
    fireEvent.click(addButton)
    
    expect(mockPush).toHaveBeenCalledWith('/product-list/create')
  })

  it('should display loading state', () => {
    ;(useProducts as jest.Mock).mockReturnValue({
      products: [],
      isLoading: true,
      error: null,
    })
    
    render(<ProductList />)
    
    // Check for loading spinner by looking for the div with animate-spin class
    const loadingSpinner = document.querySelector('.animate-spin')
    expect(loadingSpinner).toBeInTheDocument()
  })

  it('should display error state', () => {
    ;(useProducts as jest.Mock).mockReturnValue({
      products: [],
      isLoading: false,
      error: 'Failed to load products',
    })
    
    render(<ProductList />)
    
    expect(screen.getByText('Error loading products. Please try again.')).toBeInTheDocument()
  })

  it('should display empty state when no products match filters', () => {
    render(<ProductList />)
    
    const searchInput = screen.getByPlaceholderText('Search products by name or description...')
    fireEvent.change(searchInput, { target: { value: 'NonExistentProduct' } })
    
    expect(screen.getByText('No products found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search or filter criteria.')).toBeInTheDocument()
  })

  it('should display empty state when no products exist', () => {
    ;(useProducts as jest.Mock).mockReturnValue({
      products: [],
      isLoading: false,
      error: null,
    })
    
    render(<ProductList />)
    
    expect(screen.getByText('No products found')).toBeInTheDocument()
    expect(screen.getByText('Get started by adding your first product.')).toBeInTheDocument()
  })

  it('should display product images and fallback to placeholder', () => {
    render(<ProductList />)
    
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(3)
    
    // Check that images have correct src attributes
    expect(images[0]).toHaveAttribute('src', '/test-image-1.jpg')
    expect(images[1]).toHaveAttribute('src', '/test-image-2.jpg')
    expect(images[2]).toHaveAttribute('src', '/placeholder.svg') // Fallback for product without image
  })

  it('should display product prices', () => {
    render(<ProductList />)
    
    expect(screen.getByText('100 PKR')).toBeInTheDocument()
    expect(screen.getByText('200 PKR')).toBeInTheDocument()
    expect(screen.getByText('150 PKR')).toBeInTheDocument()
  })

  it('should display barcodes for products', () => {
    render(<ProductList />)
    
    const barcodes = screen.getAllByTestId('barcode')
    expect(barcodes).toHaveLength(3)
    expect(barcodes[0]).toHaveTextContent('1')
    expect(barcodes[1]).toHaveTextContent('2')
    expect(barcodes[2]).toHaveTextContent('3')
  })

  it('should combine search and status filters', () => {
    render(<ProductList />)
    
    const searchInput = screen.getByPlaceholderText('Search products by name or description...')
    fireEvent.change(searchInput, { target: { value: 'Test' } })
    
    const statusSelect = screen.getByText('All Status')
    fireEvent.click(statusSelect)
    
    const activeOption = screen.getByText('Active')
    fireEvent.click(activeOption)
    
    // Should only show Test Product 1 (matches both search and active status)
    expect(screen.getByText('Test Product 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument() // inactive
    expect(screen.queryByText('Another Product')).not.toBeInTheDocument() // doesn't match search
  })
})
