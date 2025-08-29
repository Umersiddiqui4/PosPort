import React from 'react'
import { render, screen } from '@testing-library/react'
import LocationsPage from '@/app/(dashboard)/locations/page'
import Locations from '@/components/location'

// Mock the Locations component
jest.mock('@/components/location', () => {
  return function MockLocations() {
    return <div data-testid="locations-component">Locations Component</div>
  }
})

describe('LocationsPage', () => {
  it('should render the locations page component', () => {
    render(<LocationsPage />)
    
    // Check that the Locations component is rendered
    expect(screen.getByTestId('locations-component')).toBeInTheDocument()
    expect(screen.getByText('Locations Component')).toBeInTheDocument()
  })
})
