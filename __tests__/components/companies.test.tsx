import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Companies from '@/components/companies'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCompanies } from '@/lib/Api/getCompanies'
import { createCompany } from '@/lib/Api/createCompany'
import { editCompany } from '@/lib/Api/editCompany'
import { deleteCompany } from '@/lib/Api/deleteCompany'
import { useUserDataStore } from '@/lib/store'

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }))
jest.mock('@tanstack/react-query')
jest.mock('@/lib/Api/getCompanies')
jest.mock('@/lib/Api/createCompany')
jest.mock('@/lib/Api/editCompany')
jest.mock('@/lib/Api/deleteCompany')
jest.mock('@/lib/store')

const mockPush = jest.fn()
const mockQueryClient = {
  invalidateQueries: jest.fn(),
}

const mockCompanies = [
  {
    id: '1',
    name: 'Test Company 1',
    ntn: 'NTN001',
    email: 'test1@company.com',
    phone: '+1234567890',
    address: '123 Test St',
    industry: 'Technology',
    status: 'accepted' as const,
  },
  {
    id: '2',
    name: 'Test Company 2',
    ntn: 'NTN002',
    email: 'test2@company.com',
    phone: '+0987654321',
    address: '456 Test Ave',
    industry: 'Healthcare',
    status: 'pending' as const,
  },
]

describe('Companies', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useQueryClient as jest.Mock).mockReturnValue(mockQueryClient)
    ;(useUserDataStore as jest.Mock).mockReturnValue({
      user: { role: 'POSPORT_ADMIN' },
    })
  })

  describe('Loading State', () => {
    it('should show loading state when fetching companies', () => {
      ;(useQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      })

      render(<Companies />)
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should show error message when companies fail to load', () => {
      ;(useQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        error: { message: 'Failed to load companies' },
      })

      render(<Companies />)
      expect(screen.getByText(/failed to load companies/i)).toBeInTheDocument()
    })
  })

  describe('Company Display', () => {
    it('should display companies correctly', () => {
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      expect(screen.getByText('Test Company 1')).toBeInTheDocument()
      expect(screen.getByText('Test Company 2')).toBeInTheDocument()
      expect(screen.getByText('test1@company.com')).toBeInTheDocument()
      expect(screen.getByText('test2@company.com')).toBeInTheDocument()
    })

    it('should display company status badges', () => {
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      expect(screen.getByText('accepted')).toBeInTheDocument()
      expect(screen.getByText('pending')).toBeInTheDocument()
    })

    it('should display company details in cards', () => {
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      expect(screen.getByText('NTN001')).toBeInTheDocument()
      expect(screen.getByText('NTN002')).toBeInTheDocument()
      expect(screen.getByText('Technology')).toBeInTheDocument()
      expect(screen.getByText('Healthcare')).toBeInTheDocument()
    })
  })

  describe('Search and Filter', () => {
    it('should filter companies by search term', () => {
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      const searchInput = screen.getByPlaceholderText(/search companies/i)
      fireEvent.change(searchInput, { target: { value: 'Company 1' } })
      
      expect(screen.getByText('Test Company 1')).toBeInTheDocument()
      expect(screen.queryByText('Test Company 2')).not.toBeInTheDocument()
    })

    it('should filter companies by status', () => {
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      const statusFilter = screen.getByLabelText(/status/i)
      fireEvent.click(statusFilter)
      
      const acceptedOption = screen.getByText('Accepted')
      fireEvent.click(acceptedOption)
      
      expect(screen.getByText('Test Company 1')).toBeInTheDocument()
      expect(screen.queryByText('Test Company 2')).not.toBeInTheDocument()
    })
  })

  describe('Create Company', () => {
    it('should open create company modal when create button is clicked', () => {
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      const createButton = screen.getByText(/create company/i)
      fireEvent.click(createButton)
      
      expect(screen.getByText(/create new company/i)).toBeInTheDocument()
    })

    it('should create company successfully', async () => {
      const mockCreateMutation = {
        mutate: jest.fn(),
        isLoading: false,
      }
      ;(useMutation as jest.Mock).mockReturnValue(mockCreateMutation)
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      const createButton = screen.getByText(/create company/i)
      fireEvent.click(createButton)
      
      const nameInput = screen.getByLabelText(/company name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const phoneInput = screen.getByLabelText(/phone/i)
      const addressInput = screen.getByLabelText(/address/i)
      
      fireEvent.change(nameInput, { target: { value: 'New Company' } })
      fireEvent.change(emailInput, { target: { value: 'new@company.com' } })
      fireEvent.change(phoneInput, { target: { value: '+1234567890' } })
      fireEvent.change(addressInput, { target: { value: '789 New St' } })
      
      const submitButton = screen.getByText(/create/i)
      fireEvent.click(submitButton)
      
      expect(mockCreateMutation.mutate).toHaveBeenCalledWith({
        name: 'New Company',
        email: 'new@company.com',
        phone: '+1234567890',
        address: '789 New St',
      })
    })
  })

  describe('Edit Company', () => {
    it('should open edit modal when edit button is clicked', () => {
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      const editButtons = screen.getAllByLabelText(/edit/i)
      fireEvent.click(editButtons[0])
      
      expect(screen.getByText(/edit company/i)).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Company 1')).toBeInTheDocument()
    })

    it('should update company successfully', async () => {
      const mockUpdateMutation = {
        mutate: jest.fn(),
        isLoading: false,
      }
      ;(useMutation as jest.Mock).mockReturnValue(mockUpdateMutation)
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      const editButtons = screen.getAllByLabelText(/edit/i)
      fireEvent.click(editButtons[0])
      
      const nameInput = screen.getByDisplayValue('Test Company 1')
      fireEvent.change(nameInput, { target: { value: 'Updated Company' } })
      
      const submitButton = screen.getByText(/update/i)
      fireEvent.click(submitButton)
      
      expect(mockUpdateMutation.mutate).toHaveBeenCalledWith({
        id: '1',
        name: 'Updated Company',
      })
    })
  })

  describe('Delete Company', () => {
    it('should open delete confirmation dialog when delete button is clicked', () => {
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      const deleteButtons = screen.getAllByLabelText(/delete/i)
      fireEvent.click(deleteButtons[0])
      
      expect(screen.getByText(/are you absolutely sure/i)).toBeInTheDocument()
      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument()
    })

    it('should delete company when confirmed', async () => {
      const mockDeleteMutation = {
        mutate: jest.fn(),
        isLoading: false,
      }
      ;(useMutation as jest.Mock).mockReturnValue(mockDeleteMutation)
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      const deleteButtons = screen.getAllByLabelText(/delete/i)
      fireEvent.click(deleteButtons[0])
      
      const confirmButton = screen.getByText(/delete/i)
      fireEvent.click(confirmButton)
      
      expect(mockDeleteMutation.mutate).toHaveBeenCalledWith('1')
    })
  })

  describe('Company Selection', () => {
    it('should call onCompanySelect when company is selected', () => {
      const mockOnCompanySelect = jest.fn()
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies onCompanySelect={mockOnCompanySelect} />)
      const companyCard = screen.getByText('Test Company 1').closest('div')
      fireEvent.click(companyCard!)
      
      expect(mockOnCompanySelect).toHaveBeenCalledWith('1')
    })
  })

  describe('Pagination', () => {
    it('should display pagination when there are many companies', () => {
      const manyCompanies = Array.from({ length: 25 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Company ${i + 1}`,
        ntn: `NTN${i + 1}`,
        email: `company${i + 1}@test.com`,
        phone: `+123456789${i}`,
        address: `${i + 1} Test St`,
        industry: 'Technology',
        status: 'accepted' as const,
      }))

      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: manyCompanies, total: 25 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should show validation errors for required fields', async () => {
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      const createButton = screen.getByText(/create company/i)
      fireEvent.click(createButton)
      
      const submitButton = screen.getByText(/create/i)
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/company name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      })
    })

    it('should validate email format', async () => {
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      const createButton = screen.getByText(/create company/i)
      fireEvent.click(createButton)
      
      const emailInput = screen.getByLabelText(/email/i)
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      
      const submitButton = screen.getByText(/create/i)
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading state during create operation', () => {
      const mockCreateMutation = {
        mutate: jest.fn(),
        isLoading: true,
      }
      ;(useMutation as jest.Mock).mockReturnValue(mockCreateMutation)
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      const createButton = screen.getByText(/create company/i)
      fireEvent.click(createButton)
      
      const submitButton = screen.getByText(/create/i)
      expect(submitButton).toBeDisabled()
    })

    it('should show loading state during update operation', () => {
      const mockUpdateMutation = {
        mutate: jest.fn(),
        isLoading: true,
      }
      ;(useMutation as jest.Mock).mockReturnValue(mockUpdateMutation)
      ;(useQuery as jest.Mock).mockReturnValue({
        data: { items: mockCompanies, total: 2 },
        isLoading: false,
        error: null,
      })

      render(<Companies />)
      const editButtons = screen.getAllByLabelText(/edit/i)
      fireEvent.click(editButtons[0])
      
      const submitButton = screen.getByText(/update/i)
      expect(submitButton).toBeDisabled()
    })
  })
})

