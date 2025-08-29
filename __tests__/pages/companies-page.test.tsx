import React from 'react'
import { render, screen } from '@testing-library/react'
import CompaniesPage from '@/app/(dashboard)/companies/page'
import Companies from '@/components/companies'

// Mock the Companies component
jest.mock('@/components/companies', () => {
  return function MockCompanies() {
    return <div data-testid="companies-component">Companies Component</div>
  }
})

describe('CompaniesPage', () => {
  it('should render the companies page with correct layout', () => {
    render(<CompaniesPage />)
    
    // Check that the Companies component is rendered
    expect(screen.getByTestId('companies-component')).toBeInTheDocument()
    expect(screen.getByText('Companies Component')).toBeInTheDocument()
  })

  it('should have the correct CSS classes for layout', () => {
    const { container } = render(<CompaniesPage />)
    
    const pageContainer = container.firstChild as HTMLElement
    expect(pageContainer).toHaveClass('h-screen', 'overflow-auto', 'bg-gray-50', 'pt-16', 'md:pt-16')
  })
})
