import { render, screen, fireEvent } from '@testing-library/react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

describe('AlertDialog Components', () => {
  describe('AlertDialog', () => {
    it('should render with trigger and content', () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Test Title</AlertDialogTitle>
              <AlertDialogDescription>Test Description</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

      expect(screen.getByText('Open Dialog')).toBeInTheDocument()
    })

    it('should open dialog when trigger is clicked', () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Test Title</AlertDialogTitle>
              <AlertDialogDescription>Test Description</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

      const trigger = screen.getByText('Open Dialog')
      fireEvent.click(trigger)

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Continue')).toBeInTheDocument()
    })
  })

  describe('AlertDialogContent', () => {
    it('should render with children', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <div>Test Content</div>
          </AlertDialogContent>
        </AlertDialog>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent className="custom-content">
            <div>Test Content</div>
          </AlertDialogContent>
        </AlertDialog>
      )

      const content = screen.getByText('Test Content').closest('[role="alertdialog"]')
      expect(content).toHaveClass('custom-content')
    })
  })

  describe('AlertDialogHeader', () => {
    it('should render with children', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div>Test Header</div>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )

      expect(screen.getByText('Test Header')).toBeInTheDocument()
    })
  })

  describe('AlertDialogTitle', () => {
    it('should render with text', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle className="custom-title">Test Title</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      )

      const title = screen.getByText('Test Title')
      expect(title).toHaveClass('custom-title')
    })
  })

  describe('AlertDialogDescription', () => {
    it('should render with text', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogDescription>Test Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      )

      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogDescription className="custom-description">Test Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      )

      const description = screen.getByText('Test Description')
      expect(description).toHaveClass('custom-description')
    })
  })

  describe('AlertDialogFooter', () => {
    it('should render with children', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogFooter>
              <div>Test Footer</div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

      expect(screen.getByText('Test Footer')).toBeInTheDocument()
    })
  })

  describe('AlertDialogAction', () => {
    it('should render with text', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogFooter>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

      expect(screen.getByText('Continue')).toBeInTheDocument()
    })

    it('should handle click events', () => {
      const handleClick = jest.fn()
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleClick}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

      const action = screen.getByText('Continue')
      fireEvent.click(action)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('AlertDialogCancel', () => {
    it('should render with text', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('should handle click events', () => {
      const handleClick = jest.fn()
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleClick}>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

      const cancel = screen.getByText('Cancel')
      fireEvent.click(cancel)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })
})


