import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import ProductGrid from '@/components/product-grid'
import { useProducts } from '@/hooks/use-products'

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }))
jest.mock('@/hooks/use-products')

const mockPush = jest.fn()

describe('ProductGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  const mockProducts = [
    {
      id: '1',
      name: 'Test Product 1',
      description: 'Test Description 1',
      retailPrice: 100,
      cost: 80,
      status: 'active',
      attachments: [
        {
          id: 'att-1',
          url: '/test-image-1.jpg',
          filename: 'test-image-1.jpg',
          size: 1024,
        },
      ],
    },
    {
      id: '2',
      name: 'Test Product 2',
      description: 'Test Description 2',
      retailPrice: 200,
      cost: 160,
      status: 'inactive',
      attachments: [],
    },
  ]

  describe('Loading State', () => {
    it('should show loading skeleton when products are loading', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: [],
        isLoading: true,
        error: null,
      })

      render(<ProductGrid />)
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should show error message when products fail to load', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: [],
        isLoading: false,
        error: 'Failed to load products',
      })

      render(<ProductGrid />)
      expect(screen.getByText('Error loading products. Please try again.')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no products are available', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: [],
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      expect(screen.getByText('No products found')).toBeInTheDocument()
    })
  })

  describe('Product Display', () => {
    it('should display products correctly', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      expect(screen.getByText('Test Product 1')).toBeInTheDocument()
      expect(screen.getByText('Test Product 2')).toBeInTheDocument()
      expect(screen.getByText('100 PKR')).toBeInTheDocument()
      expect(screen.getByText('200 PKR')).toBeInTheDocument()
    })

    it('should display product images when available', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      const images = screen.getAllByAltText(/Test Product/)
      expect(images).toHaveLength(2)
    })

    it('should display placeholder image when no attachments', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: [mockProducts[1]], // Product without attachments
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      const placeholderImage = screen.getByAltText('Test Product 2')
      expect(placeholderImage).toHaveAttribute('src', '/placeholder.svg')
    })

    it('should display product status badges', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      expect(screen.getByText('active')).toBeInTheDocument()
      expect(screen.getByText('inactive')).toBeInTheDocument()
    })
  })

  describe('Product Interactions', () => {
    it('should navigate to product detail when product card is clicked', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      const productCard = screen.getByText('Test Product 1').closest('div')
      fireEvent.click(productCard!)
      
      expect(mockPush).toHaveBeenCalledWith('/product-list/1')
    })

    it('should navigate to product detail when product name is clicked', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      const productName = screen.getByText('Test Product 1')
      fireEvent.click(productName)
      
      expect(mockPush).toHaveBeenCalledWith('/product-list/1')
    })
  })

  describe('Search and Filter', () => {
    it('should filter products by search term', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      const searchInput = screen.getByPlaceholderText(/search products/i)
      fireEvent.change(searchInput, { target: { value: 'Product 1' } })
      
      expect(screen.getByText('Test Product 1')).toBeInTheDocument()
      expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument()
    })

    it('should show all products when search is cleared', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      const searchInput = screen.getByPlaceholderText(/search products/i)
      fireEvent.change(searchInput, { target: { value: 'Product 1' } })
      fireEvent.change(searchInput, { target: { value: '' } })
      
      expect(screen.getByText('Test Product 1')).toBeInTheDocument()
      expect(screen.getByText('Test Product 2')).toBeInTheDocument()
    })

    it('should filter products by status', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      const statusSelect = screen.getByRole('combobox')
      fireEvent.click(statusSelect)
      
      const activeOption = screen.getByText('Active')
      fireEvent.click(activeOption)
      
      expect(screen.getByText('Test Product 1')).toBeInTheDocument()
      expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument()
    })
  })

  describe('Sorting', () => {
    it('should sort products by name', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      const sortSelect = screen.getByLabelText(/sort by/i)
      fireEvent.click(sortSelect)
      
      const nameOption = screen.getByText('Name')
      fireEvent.click(nameOption)
      
      const productNames = screen.getAllByText(/Test Product/)
      expect(productNames[0]).toHaveTextContent('Test Product 1')
      expect(productNames[1]).toHaveTextContent('Test Product 2')
    })

    it('should sort products by price', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      const sortSelect = screen.getByLabelText(/sort by/i)
      fireEvent.click(sortSelect)
      
      const priceOption = screen.getByText('Price')
      fireEvent.click(priceOption)
      
      const prices = screen.getAllByText(/\d+ PKR/)
      expect(prices[0]).toHaveTextContent('100 PKR')
      expect(prices[1]).toHaveTextContent('200 PKR')
    })
  })

  describe('Pagination', () => {
    it('should display pagination when there are many products', () => {
      const manyProducts = Array.from({ length: 25 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Product ${i + 1}`,
        description: `Description ${i + 1}`,
        retailPrice: 100 + i,
        cost: 80 + i,
        status: 'active' as const,
        attachments: [],
      }))

      ;(useProducts as jest.Mock).mockReturnValue({
        products: manyProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('should navigate to next page when next button is clicked', () => {
      const manyProducts = Array.from({ length: 25 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Product ${i + 1}`,
        description: `Description ${i + 1}`,
        retailPrice: 100 + i,
        cost: 80 + i,
        status: 'active' as const,
        attachments: [],
      }))

      ;(useProducts as jest.Mock).mockReturnValue({
        products: manyProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      const nextButton = screen.getByLabelText(/next page/i)
      fireEvent.click(nextButton)
      
      expect(screen.getByText('2')).toHaveClass('bg-primary')
    })
  })

  describe('Create Product Button', () => {
    it('should navigate to create product page when button is clicked', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      const createButton = screen.getByText(/create product/i)
      fireEvent.click(createButton)
      
      expect(mockPush).toHaveBeenCalledWith('/product-list/create')
    })
  })

  describe('Product Actions', () => {
    it('should show edit and delete buttons for each product', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      const editButtons = screen.getAllByLabelText(/edit/i)
      const deleteButtons = screen.getAllByLabelText(/delete/i)
      
      expect(editButtons).toHaveLength(2)
      expect(deleteButtons).toHaveLength(2)
    })

    it('should navigate to edit page when edit button is clicked', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      const editButtons = screen.getAllByLabelText(/edit/i)
      fireEvent.click(editButtons[0])
      
      expect(mockPush).toHaveBeenCalledWith('/product-list/1/edit')
    })

    it('should open delete confirmation dialog when delete button is clicked', () => {
      ;(useProducts as jest.Mock).mockReturnValue({
        products: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<ProductGrid />)
      const deleteButtons = screen.getAllByLabelText(/delete/i)
      fireEvent.click(deleteButtons[0])
      
      expect(screen.getByText(/are you absolutely sure/i)).toBeInTheDocument()
    })
  })
})
