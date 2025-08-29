import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import ProductForm from '@/components/product-form'
import { useToast } from '@/hooks/use-toast'
import { createProduct } from '@/lib/Api/createProduct'
import { updateProduct } from '@/lib/Api/updateProduct'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock hooks
jest.mock('@/hooks/use-toast')

// Mock API functions
jest.mock('@/lib/Api/createProduct')
jest.mock('@/lib/Api/updateProduct')

const mockPush = jest.fn()
const mockToast = jest.fn()
const mockCreateProduct = createProduct as jest.MockedFunction<typeof createProduct>
const mockUpdateProduct = updateProduct as jest.MockedFunction<typeof updateProduct>

describe('ProductForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
  })

  describe('Create Mode', () => {
    it('should render create form with empty fields', () => {
      render(<ProductForm />)
      
      expect(screen.getByText('Create Product')).toBeInTheDocument()
      expect(screen.getByLabelText(/name/i)).toHaveValue('')
      expect(screen.getByLabelText(/description/i)).toHaveValue('')
      expect(screen.getByLabelText(/price/i)).toHaveValue('')
    })

    it('should handle form submission for new product', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        retailPrice: 100,
        status: 'active',
      }

      mockCreateProduct.mockResolvedValue({
        data: mockProduct,
        message: 'Product created successfully',
        status: 201,
      })

      render(<ProductForm />)
      
      // Fill form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test Product' },
      })
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Test Description' },
      })
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '100' },
      })
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockCreateProduct).toHaveBeenCalledWith({
          name: 'Test Product',
          description: 'Test Description',
          retailPrice: 100,
          status: 'active',
        })
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Success',
          description: 'Product created successfully',
        })
        expect(mockPush).toHaveBeenCalledWith('/product-list')
      })
    })

    it('should handle form submission errors', async () => {
      mockCreateProduct.mockRejectedValue(new Error('Failed to create product'))

      render(<ProductForm />)
      
      // Fill form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test Product' },
      })
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '100' },
      })
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Failed to create product',
          variant: 'destructive',
        })
      })
    })

    it('should validate required fields', async () => {
      render(<ProductForm />)
      
      // Submit form without filling required fields
      const submitButton = screen.getByRole('button', { name: /create/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/price is required/i)).toBeInTheDocument()
      })
      
      expect(mockCreateProduct).not.toHaveBeenCalled()
    })

    it('should validate price format', async () => {
      render(<ProductForm />)
      
      // Fill form with invalid price
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test Product' },
      })
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: 'invalid' },
      })
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/price must be a valid number/i)).toBeInTheDocument()
      })
      
      expect(mockCreateProduct).not.toHaveBeenCalled()
    })
  })

  describe('Edit Mode', () => {
    const mockProduct = {
      id: '1',
      name: 'Existing Product',
      description: 'Existing Description',
      retailPrice: 150,
      cost: 100,
      status: 'active',
      locationId: 'loc-1',
      companyId: 'comp-1',
      catalogId: 'cat-1',
    }

    it('should render edit form with existing data', () => {
      render(<ProductForm product={mockProduct} />)
      
      expect(screen.getByText('Edit Product')).toBeInTheDocument()
      expect(screen.getByLabelText(/name/i)).toHaveValue('Existing Product')
      expect(screen.getByLabelText(/description/i)).toHaveValue('Existing Description')
      expect(screen.getByLabelText(/price/i)).toHaveValue('150')
      expect(screen.getByLabelText(/cost/i)).toHaveValue('100')
    })

    it('should handle form submission for existing product', async () => {
      const updatedProduct = {
        ...mockProduct,
        name: 'Updated Product',
        retailPrice: 200,
      }

      mockUpdateProduct.mockResolvedValue({
        data: updatedProduct,
        message: 'Product updated successfully',
        status: 200,
      })

      render(<ProductForm product={mockProduct} />)
      
      // Update form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Updated Product' },
      })
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '200' },
      })
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /update/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockUpdateProduct).toHaveBeenCalledWith('1', {
          name: 'Updated Product',
          description: 'Existing Description',
          retailPrice: 200,
          cost: 100,
          status: 'active',
        })
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Success',
          description: 'Product updated successfully',
        })
        expect(mockPush).toHaveBeenCalledWith('/product-list')
      })
    })

    it('should handle update errors', async () => {
      mockUpdateProduct.mockRejectedValue(new Error('Failed to update product'))

      render(<ProductForm product={mockProduct} />)
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /update/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Failed to update product',
          variant: 'destructive',
        })
      })
    })
  })

  describe('Form Interactions', () => {
    it('should handle input changes', () => {
      render(<ProductForm />)
      
      const nameInput = screen.getByLabelText(/name/i)
      const descriptionInput = screen.getByLabelText(/description/i)
      const priceInput = screen.getByLabelText(/price/i)
      
      fireEvent.change(nameInput, { target: { value: 'New Product' } })
      fireEvent.change(descriptionInput, { target: { value: 'New Description' } })
      fireEvent.change(priceInput, { target: { value: '99.99' } })
      
      expect(nameInput).toHaveValue('New Product')
      expect(descriptionInput).toHaveValue('New Description')
      expect(priceInput).toHaveValue('99.99')
    })

    it('should handle status selection', () => {
      render(<ProductForm />)
      
      const statusSelect = screen.getByLabelText(/status/i)
      fireEvent.change(statusSelect, { target: { value: 'inactive' } })
      
      expect(statusSelect).toHaveValue('inactive')
    })

    it('should handle cancel button', () => {
      render(<ProductForm />)
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)
      
      expect(mockPush).toHaveBeenCalledWith('/product-list')
    })

    it('should show loading state during submission', async () => {
      mockCreateProduct.mockImplementation(() => new Promise(() => {}))

      render(<ProductForm />)
      
      // Fill form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test Product' },
      })
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '100' },
      })
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create/i })
      fireEvent.click(submitButton)
      
      expect(submitButton).toBeDisabled()
      expect(screen.getByText(/creating/i)).toBeInTheDocument()
    })
  })

  describe('Validation', () => {
    it('should validate minimum price', async () => {
      render(<ProductForm />)
      
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test Product' },
      })
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '-10' },
      })
      
      const submitButton = screen.getByRole('button', { name: /create/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/price must be greater than 0/i)).toBeInTheDocument()
      })
    })

    it('should validate maximum price', async () => {
      render(<ProductForm />)
      
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test Product' },
      })
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '1000000' },
      })
      
      const submitButton = screen.getByRole('button', { name: /create/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/price must be less than 100000/i)).toBeInTheDocument()
      })
    })

    it('should validate name length', async () => {
      render(<ProductForm />)
      
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'A'.repeat(101) },
      })
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '100' },
      })
      
      const submitButton = screen.getByRole('button', { name: /create/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/name must be less than 100 characters/i)).toBeInTheDocument()
      })
    })

    it('should validate description length', async () => {
      render(<ProductForm />)
      
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test Product' },
      })
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'A'.repeat(501) },
      })
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '100' },
      })
      
      const submitButton = screen.getByRole('button', { name: /create/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/description must be less than 500 characters/i)).toBeInTheDocument()
      })
    })
  })
})

