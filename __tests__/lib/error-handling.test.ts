import { 
  errorHandler, 
  createError, 
  isNetworkError, 
  isAuthError, 
  getErrorMessage, 
  getErrorTitle,
  ErrorType,
  ERROR_MESSAGES,
  ConsoleErrorLogger,
  ProductionErrorLogger
} from '@/lib/error-handling'

describe('Error Handling Utilities', () => {
  let consoleGroupSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('createError', () => {
    it('should create an AppError with correct properties', () => {
      const error = createError(ErrorType.VALIDATION, 'Invalid input')
      
      expect(error.type).toBe(ErrorType.VALIDATION)
      expect(error.message).toBe('Invalid input')
      expect(error.timestamp).toBeInstanceOf(Date)
      expect(error.originalError).toBeUndefined()
      expect(error.context).toBeUndefined()
    })

    it('should create error with original error and context', () => {
      const originalError = new Error('Original error')
      const context = { userId: '123', action: 'create' }
      const error = createError(ErrorType.SERVER, 'Server error', originalError, context)
      
      expect(error.originalError).toBe(originalError)
      expect(error.context).toEqual(context)
    })

    it('should ensure message is always a string', () => {
      const error1 = createError(ErrorType.UNKNOWN, 123 as any)
      const error2 = createError(ErrorType.UNKNOWN, { message: 'test' } as any)
      
      expect(error1.message).toBe('123')
      expect(error2.message).toBe('[object Object]')
    })
  })

  describe('isNetworkError', () => {
    it('should return true for network errors', () => {
      const networkError = new Error('Network Error')
      networkError.name = 'NetworkError'
      
      expect(isNetworkError(networkError)).toBe(true)
    })

    it('should return true for errors with network in message', () => {
      const networkError = new Error('Failed to fetch: network error')
      
      expect(isNetworkError(networkError)).toBe(true)
    })

    it('should return false for other errors', () => {
      const regularError = new Error('Regular error')
      
      expect(isNetworkError(regularError)).toBe(false)
    })

    it('should return false for non-Error objects', () => {
      expect(isNetworkError('string')).toBe(false)
      expect(isNetworkError({ message: 'error' })).toBe(false)
      expect(isNetworkError(null)).toBe(false)
    })
  })

  describe('isAuthError', () => {
    it('should return true for 401 status errors', () => {
      const authError = { status: 401, message: 'Unauthorized' }
      
      expect(isAuthError(authError)).toBe(true)
    })

    it('should return false for other status codes', () => {
      const serverError = { status: 500, message: 'Server Error' }
      const notFoundError = { status: 404, message: 'Not Found' }
      
      expect(isAuthError(serverError)).toBe(false)
      expect(isAuthError(notFoundError)).toBe(false)
    })

    it('should return false for objects without status', () => {
      expect(isAuthError({ message: 'error' })).toBe(false)
      expect(isAuthError(new Error('error'))).toBe(false)
      expect(isAuthError('string')).toBe(false)
    })
  })

  describe('getErrorMessage', () => {
    it('should return predefined message for known error types', () => {
      const validationError = createError(ErrorType.VALIDATION, 'Custom message')
      const networkError = createError(ErrorType.NETWORK, 'Custom message')
      
      expect(getErrorMessage(validationError)).toBe(ERROR_MESSAGES[ErrorType.VALIDATION].message)
      expect(getErrorMessage(networkError)).toBe(ERROR_MESSAGES[ErrorType.NETWORK].message)
    })

    it('should return custom message for unknown error types', () => {
      const customError = createError(ErrorType.UNKNOWN, 'Custom error message')
      
      expect(getErrorMessage(customError)).toBe(ERROR_MESSAGES[ErrorType.UNKNOWN].message)
    })
  })

  describe('getErrorTitle', () => {
    it('should return predefined title for known error types', () => {
      const validationError = createError(ErrorType.VALIDATION, 'Custom message')
      const authError = createError(ErrorType.AUTHENTICATION, 'Custom message')
      
      expect(getErrorTitle(validationError)).toBe(ERROR_MESSAGES[ErrorType.VALIDATION].title)
      expect(getErrorTitle(authError)).toBe(ERROR_MESSAGES[ErrorType.AUTHENTICATION].title)
    })

    it('should return default title for unknown error types', () => {
      const customError = createError(ErrorType.UNKNOWN, 'Custom error message')
      
      expect(getErrorTitle(customError)).toBe(ERROR_MESSAGES[ErrorType.UNKNOWN].title)
    })
  })

  describe('ConsoleErrorLogger', () => {
    let logger: ConsoleErrorLogger

    beforeEach(() => {
      logger = new ConsoleErrorLogger()
    })

    it('should log AppError correctly', () => {
      const error = createError(ErrorType.VALIDATION, 'Test error')
      
      logger.log(error)
      
      expect(consoleGroupSpy).toHaveBeenCalledWith('🚨 VALIDATION Error')
      expect(consoleErrorSpy).toHaveBeenCalledWith('Message:', 'Test error')
      expect(consoleErrorSpy).toHaveBeenCalledWith('Timestamp:', error.timestamp)
    })

    it('should normalize and log API errors', () => {
      const apiError = {
        message: 'API Error',
        status: 400,
        response: { data: { detail: 'Bad request' } }
      }
      
      logger.logError(apiError)
      
      expect(consoleGroupSpy).toHaveBeenCalled()
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should normalize and log regular errors', () => {
      const regularError = new Error('Regular error')
      
      logger.logError(regularError)
      
      expect(consoleGroupSpy).toHaveBeenCalledWith('🚨 UNKNOWN Error')
      expect(consoleErrorSpy).toHaveBeenCalledWith('Message:', 'Regular error')
    })

    it('should handle non-Error objects', () => {
      const stringError = 'String error'
      
      logger.logError(stringError)
      
      expect(consoleGroupSpy).toHaveBeenCalledWith('🚨 UNKNOWN Error')
      expect(consoleErrorSpy).toHaveBeenCalledWith('Message:', 'String error')
    })
  })

  describe('ProductionErrorLogger', () => {
    let logger: ProductionErrorLogger
    let consoleErrorSpy: jest.SpyInstance

    beforeEach(() => {
      logger = new ProductionErrorLogger()
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    })

    afterEach(() => {
      consoleErrorSpy.mockRestore()
    })

    it('should log errors in production format', () => {
      const error = createError(ErrorType.SERVER, 'Production error')
      
      logger.log(error)
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Production Error:', error)
    })

    it('should normalize and log errors', () => {
      const regularError = new Error('Regular error')
      
      logger.logError(regularError)
      
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('errorHandler', () => {
    it('should handle AppError directly', () => {
      const error = createError(ErrorType.VALIDATION, 'Test error')
      
      const result = errorHandler.handle(error)
      
      expect(result).toBe(error)
      expect(consoleGroupSpy).toHaveBeenCalled()
    })

    it('should normalize and handle API errors', () => {
      const apiError = {
        message: 'API Error',
        status: 401,
        response: { data: { detail: 'Unauthorized' } }
      }
      
      const result = errorHandler.handle(apiError)
      
      expect(result.type).toBe(ErrorType.AUTHENTICATION)
      expect(result.message).toBe('API Error')
      expect(result.status).toBe(401)
    })

    it('should normalize and handle regular errors', () => {
      const regularError = new Error('Regular error')
      
      const result = errorHandler.handle(regularError)
      
      expect(result.type).toBe(ErrorType.UNKNOWN)
      expect(result.message).toBe('Regular error')
      expect(result.originalError).toBe(regularError)
    })

    it('should handle non-Error objects', () => {
      const stringError = 'String error'
      
      const result = errorHandler.handle(stringError)
      
      expect(result.type).toBe(ErrorType.UNKNOWN)
      expect(result.message).toBe('String error')
    })

    it('should handle async errors', async () => {
      const error = new Error('Async error')
      const promise = Promise.reject(error)
      
      await expect(errorHandler.handleAsync(promise)).rejects.toThrow('Async error')
      expect(consoleGroupSpy).toHaveBeenCalled()
    })
  })

  describe('ErrorType enum', () => {
    it('should have all expected error types', () => {
      expect(ErrorType.NETWORK).toBe('NETWORK')
      expect(ErrorType.AUTHENTICATION).toBe('AUTHENTICATION')
      expect(ErrorType.AUTHORIZATION).toBe('AUTHORIZATION')
      expect(ErrorType.VALIDATION).toBe('VALIDATION')
      expect(ErrorType.NOT_FOUND).toBe('NOT_FOUND')
      expect(ErrorType.SERVER).toBe('SERVER')
      expect(ErrorType.UNKNOWN).toBe('UNKNOWN')
    })
  })

  describe('ERROR_MESSAGES', () => {
    it('should have messages for all error types', () => {
      expect(ERROR_MESSAGES[ErrorType.NETWORK]).toBeDefined()
      expect(ERROR_MESSAGES[ErrorType.AUTHENTICATION]).toBeDefined()
      expect(ERROR_MESSAGES[ErrorType.AUTHORIZATION]).toBeDefined()
      expect(ERROR_MESSAGES[ErrorType.VALIDATION]).toBeDefined()
      expect(ERROR_MESSAGES[ErrorType.NOT_FOUND]).toBeDefined()
      expect(ERROR_MESSAGES[ErrorType.SERVER]).toBeDefined()
      expect(ERROR_MESSAGES[ErrorType.UNKNOWN]).toBeDefined()
    })

    it('should have title and message for each error type', () => {
      Object.values(ErrorType).forEach(errorType => {
        const message = ERROR_MESSAGES[errorType]
        expect(message.title).toBeDefined()
        expect(message.message).toBeDefined()
        expect(typeof message.title).toBe('string')
        expect(typeof message.message).toBe('string')
      })
    })
  })
})
