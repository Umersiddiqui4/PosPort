import { cn } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn function', () => {
    it('should combine class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
    })

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null, 'valid')).toBe('base valid')
    })

    it('should handle empty strings', () => {
      expect(cn('base', '', 'valid')).toBe('base valid')
    })

    it('should handle objects with boolean values', () => {
      expect(cn('base', { 'conditional': true, 'hidden': false })).toBe('base conditional')
    })

    it('should handle arrays', () => {
      expect(cn('base', ['class1', 'class2'])).toBe('base class1 class2')
    })

    it('should handle mixed inputs', () => {
      expect(cn('base', 'class1', { 'conditional': true }, ['class2', 'class3'])).toBe('base class1 conditional class2 class3')
    })

    it('should merge Tailwind classes correctly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    })

    it('should handle complex Tailwind merging', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
      expect(cn('bg-red-500 text-white', 'bg-blue-500')).toBe('text-white bg-blue-500')
    })
  })
})

