import React from 'react'
import { render, screen } from '@testing-library/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

describe('Avatar Components', () => {
  describe('Avatar', () => {
    it('should render avatar with default props', () => {
      render(<Avatar>Avatar content</Avatar>)

      const avatar = screen.getByText('Avatar content').parentElement
      expect(avatar).toBeInTheDocument()
      expect(avatar?.tagName).toBe('DIV') // Radix Avatar uses div
    })

    it('should apply custom className', () => {
      const { container } = render(<Avatar className="custom-avatar">Avatar content</Avatar>)

      const avatar = container.querySelector('.custom-avatar')
      expect(avatar).toBeInTheDocument()
    })

    it('should render with proper structure', () => {
      render(<Avatar>Avatar content</Avatar>)

      const avatar = screen.getByText('Avatar content').parentElement
      expect(avatar).toBeInTheDocument()
      expect(avatar?.tagName).toBe('DIV')
    })
  })

  describe('Avatar with Fallback', () => {
    it('should render avatar with fallback', () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )

      const fallback = screen.getByText('JD')
      expect(fallback).toBeInTheDocument()
      expect(fallback).toHaveClass('flex')
      expect(fallback).toHaveClass('h-full')
      expect(fallback).toHaveClass('w-full')
      expect(fallback).toHaveClass('items-center')
      expect(fallback).toHaveClass('justify-center')
      expect(fallback).toHaveClass('rounded-full')
    })

    it('should apply custom className to fallback', () => {
      render(
        <Avatar>
          <AvatarFallback className="custom-fallback">JD</AvatarFallback>
        </Avatar>
      )

      const fallback = screen.getByText('JD')
      expect(fallback).toHaveClass('custom-fallback')
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

      // The fallback should be rendered initially
      const fallback = screen.getByText('JD')
      expect(fallback).toBeInTheDocument()

      // Avatar container should exist
      const avatar = fallback.parentElement?.parentElement
      expect(avatar).toBeInTheDocument()
      expect(avatar?.tagName).toBe('DIV')
    })
  })
})
