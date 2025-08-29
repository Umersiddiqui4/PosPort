import React from 'react'
import { render, screen } from '@testing-library/react'
import Users from '@/app/(dashboard)/users/page'
import UsersPage from '@/pages/users-page'

// Mock the UsersPage component
jest.mock('@/pages/users-page', () => {
  return function MockUsersPage() {
    return <div data-testid="users-page-component">Users Page Component</div>
  }
})

describe('Users Page', () => {
  it('should render the users page component', () => {
    render(<Users />)
    
    // Check that the UsersPage component is rendered
    expect(screen.getByTestId('users-page-component')).toBeInTheDocument()
    expect(screen.getByText('Users Page Component')).toBeInTheDocument()
  })
})
