import React from 'react'
import { render, screen } from '@testing-library/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

describe('Avatar Components', () => {
  describe('Avatar', () => {
    it('should render avatar with default props', () => {
      render(<Avatar>Avatar content</Avatar>)
      
      const avatar = screen.getByRole('img')
      expect(avatar).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<Avatar className="custom-avatar">Avatar content</Avatar>)
      
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('custom-avatar')
    })

    it('should have default styling classes', () => {
      render(<Avatar>Avatar content</Avatar>)
      
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('relative')
      expect(avatar).toHaveClass('flex')
      expect(avatar).toHaveClass('h-10')
      expect(avatar).toHaveClass('w-10')
      expect(avatar).toHaveClass('shrink-0')
      expect(avatar).toHaveClass('overflow-hidden')
      expect(avatar).toHaveClass('rounded-full')
    })
  })

  describe('AvatarImage', () => {
    it('should render avatar image with src', () => {
      render(<AvatarImage src="/test-image.jpg" alt="Test Avatar" />)
      
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('src', '/test-image.jpg')
      expect(image).toHaveAttribute('alt', 'Test Avatar')
    })

    it('should apply custom className', () => {
      render(<AvatarImage src="/test.jpg" alt="Test" className="custom-image" />)
      
      const image = screen.getByRole('img')
      expect(image).toHaveClass('custom-image')
    })

    it('should have default styling classes', () => {
      render(<AvatarImage src="/test.jpg" alt="Test" />)
      
      const image = screen.getByRole('img')
      expect(image).toHaveClass('aspect-square')
      expect(image).toHaveClass('h-full')
      expect(image).toHaveClass('w-full')
    })
  })

  describe('AvatarFallback', () => {
    it('should render avatar fallback', () => {
      render(<AvatarFallback>JD</AvatarFallback>)
      
      const fallback = screen.getByText('JD')
      expect(fallback).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<AvatarFallback className="custom-fallback">JD</AvatarFallback>)
      
      const fallback = screen.getByText('JD')
      expect(fallback).toHaveClass('custom-fallback')
    })

    it('should have default styling classes', () => {
      render(<AvatarFallback>JD</AvatarFallback>)
      
      const fallback = screen.getByText('JD')
      expect(fallback).toHaveClass('flex')
      expect(fallback).toHaveClass('h-full')
      expect(fallback).toHaveClass('w-full')
      expect(fallback).toHaveClass('items-center')
      expect(fallback).toHaveClass('justify-center')
      expect(fallback).toHaveClass('rounded-full')
    })
  })

  describe('Complete Avatar Structure', () => {
    it('should render complete avatar with image and fallback', () => {
      render(
        <Avatar>
          <AvatarImage src="/test.jpg" alt="Test Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
      
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('src', '/test.jpg')
      expect(image).toHaveAttribute('alt', 'Test Avatar')
      expect(screen.getByText('JD')).toBeInTheDocument()
    })
  })
})
