import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarFooterButton,
  SidebarInput,
  SidebarSeparator,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarRail,
} from '@/components/ui/sidebar'

describe('Sidebar Components', () => {
  describe('Sidebar', () => {
    it('should render sidebar with children', () => {
      render(
        <Sidebar>
          <div data-testid="sidebar-content">Sidebar Content</div>
        </Sidebar>
      )

      expect(screen.getByTestId('sidebar-content')).toBeInTheDocument()
    })

    it('should render sidebar with custom width', () => {
      render(
        <Sidebar width="20rem">
          <div data-testid="sidebar-content">Sidebar Content</div>
        </Sidebar>
      )

      const sidebar = screen.getByTestId('sidebar-content').closest('[class*="group/sidebar-wrapper"]')
      expect(sidebar).toHaveStyle({ '--sidebar-width': '20rem' })
    })
  })

  describe('SidebarContent', () => {
    it('should render content with children', () => {
      render(
        <SidebarContent>
          <div data-testid="main-content">Main Content</div>
        </SidebarContent>
      )

      expect(screen.getByTestId('main-content')).toBeInTheDocument()
    })
  })

  describe('SidebarFooter', () => {
    it('should render footer with children', () => {
      render(
        <SidebarFooter>
          <div data-testid="footer-content">Footer Content</div>
        </SidebarFooter>
      )

      expect(screen.getByTestId('footer-content')).toBeInTheDocument()
    })
  })

  describe('SidebarFooterButton', () => {
    it('should render footer button', () => {
      render(
        <SidebarFooterButton>
          <span data-testid="footer-button">Footer Button</span>
        </SidebarFooterButton>
      )

      expect(screen.getByTestId('footer-button')).toBeInTheDocument()
    })
  })

  describe('SidebarInput', () => {
    it('should render input with placeholder', () => {
      render(
        <SidebarInput placeholder="Search..." data-testid="search-input" />
      )

      expect(screen.getByTestId('search-input')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    })

    it('should handle input changes', () => {
      render(
        <SidebarInput placeholder="Search..." data-testid="search-input" />
      )

      const input = screen.getByTestId('search-input')
      fireEvent.change(input, { target: { value: 'test search' } })
      
      expect(input).toHaveValue('test search')
    })
  })

  describe('SidebarSeparator', () => {
    it('should render separator', () => {
      render(<SidebarSeparator data-testid="separator" />)

      expect(screen.getByTestId('separator')).toBeInTheDocument()
    })
  })

  describe('SidebarGroup', () => {
    it('should render group with label and content', () => {
      render(
        <SidebarGroup label="Group Label">
          <div data-testid="group-content">Group Content</div>
        </SidebarGroup>
      )

      expect(screen.getByTestId('group-content')).toBeInTheDocument()
    })
  })

  describe('SidebarMenu', () => {
    it('should render menu with items', () => {
      render(
        <SidebarMenu>
          <div data-testid="menu-item">Menu Item</div>
        </SidebarMenu>
      )

      expect(screen.getByTestId('menu-item')).toBeInTheDocument()
    })
  })

  describe('SidebarMenuButton', () => {
    it('should render menu button', () => {
      render(
        <SidebarMenuButton>
          <span data-testid="button-text">Button Text</span>
        </SidebarMenuButton>
      )

      expect(screen.getByTestId('button-text')).toBeInTheDocument()
    })

    it('should handle click events', () => {
      const onClick = jest.fn()
      render(
        <SidebarMenuButton onClick={onClick}>
          <span data-testid="clickable-button">Clickable Button</span>
        </SidebarMenuButton>
      )

      fireEvent.click(screen.getByTestId('clickable-button'))
      expect(onClick).toHaveBeenCalled()
    })

    it('should render with active state', () => {
      render(
        <SidebarMenuButton active>
          <span data-testid="active-button">Active Button</span>
        </SidebarMenuButton>
      )

      const button = screen.getByTestId('active-button').closest('button')
      expect(button).toHaveAttribute('data-active', 'true')
    })
  })

  describe('SidebarMenuBadge', () => {
    it('should render badge with text', () => {
      render(
        <SidebarMenuBadge>
          <span data-testid="badge-text">5</span>
        </SidebarMenuBadge>
      )

      expect(screen.getByTestId('badge-text')).toBeInTheDocument()
    })
  })

  describe('SidebarMenuSkeleton', () => {
    it('should render skeleton with specified width', () => {
      render(
        <SidebarMenuSkeleton width="200px" data-testid="skeleton" />
      )

      const skeleton = screen.getByTestId('skeleton')
      expect(skeleton).toHaveStyle({ '--skeleton-width': '200px' })
    })

    it('should render skeleton with icon when showIcon is true', () => {
      render(
        <SidebarMenuSkeleton showIcon data-testid="skeleton-with-icon" />
      )

      expect(screen.getByTestId('skeleton-with-icon')).toBeInTheDocument()
    })
  })

  describe('SidebarMenuSub', () => {
    it('should render sub menu with items', () => {
      render(
        <SidebarMenuSub>
          <div data-testid="sub-item">Sub Item</div>
        </SidebarMenuSub>
      )

      expect(screen.getByTestId('sub-item')).toBeInTheDocument()
    })
  })

  describe('SidebarMenuSubButton', () => {
    it('should render sub button', () => {
      render(
        <SidebarMenuSubButton>
          <span data-testid="sub-button">Sub Button</span>
        </SidebarMenuSubButton>
      )

      expect(screen.getByTestId('sub-button')).toBeInTheDocument()
    })

    it('should render with active state', () => {
      render(
        <SidebarMenuSubButton active>
          <span data-testid="active-sub-button">Active Sub Button</span>
        </SidebarMenuSubButton>
      )

      const button = screen.getByTestId('active-sub-button').closest('button')
      expect(button).toHaveAttribute('data-active', 'true')
    })

    it('should render with different sizes', () => {
      render(
        <SidebarMenuSubButton size="sm">
          <span data-testid="small-button">Small Button</span>
        </SidebarMenuSubButton>
      )

      const button = screen.getByTestId('small-button').closest('button')
      expect(button).toHaveAttribute('data-size', 'sm')
    })
  })

  describe('SidebarRail', () => {
    it('should render rail with children', () => {
      render(
        <SidebarRail>
          <div data-testid="rail-content">Rail Content</div>
        </SidebarRail>
      )

      expect(screen.getByTestId('rail-content')).toBeInTheDocument()
    })
  })
})
