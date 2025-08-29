import { schemas } from '@/lib/validations'

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    it('should validate a valid email', () => {
      const result = schemas.user.shape.email.safeParse('test@example.com')
      expect(result.success).toBe(true)
    })

    it('should reject an invalid email', () => {
      const result = schemas.user.shape.email.safeParse('invalid-email')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address')
      }
    })

    it('should reject empty string', () => {
      const result = schemas.user.shape.email.safeParse('')
      expect(result.success).toBe(false)
    })
  })

  describe('passwordSchema', () => {
    it('should validate a valid password', () => {
      const result = schemas.loginRequest.shape.password.safeParse('password123')
      expect(result.success).toBe(true)
    })

    it('should reject password shorter than 8 characters', () => {
      const result = schemas.loginRequest.shape.password.safeParse('short')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 8 characters')
      }
    })
  })

  describe('idSchema', () => {
    it('should validate a valid UUID', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000'
      const result = schemas.user.shape.id.safeParse(validUUID)
      expect(result.success).toBe(true)
    })

    it('should reject an invalid UUID', () => {
      const result = schemas.user.shape.id.safeParse('invalid-uuid')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid ID format')
      }
    })
  })

  describe('userSchema', () => {
    it('should validate a complete user object', () => {
      const validUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        role: 'CASHIER',
        companyId: '123e4567-e89b-12d3-a456-426614174001',
        locationId: '123e4567-e89b-12d3-a456-426614174002',
        isEmailVerified: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      }
      const result = schemas.user.safeParse(validUser)
      expect(result.success).toBe(true)
    })

    it('should reject user with missing required fields', () => {
      const invalidUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        // missing firstName and lastName
        role: 'CASHIER',
        isEmailVerified: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      }
      const result = schemas.user.safeParse(invalidUser)
      expect(result.success).toBe(false)
    })
  })

  describe('createUserSchema', () => {
    it('should validate a valid create user request', () => {
      const validRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        phone: '+1234567890',
        role: 'CASHIER',
        companyId: '123e4567-e89b-12d3-a456-426614174000',
      }
      const result = schemas.createUser.safeParse(validRequest)
      expect(result.success).toBe(true)
    })

    it('should reject request with invalid email', () => {
      const invalidRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        role: 'CASHIER',
      }
      const result = schemas.createUser.safeParse(invalidRequest)
      expect(result.success).toBe(false)
    })
  })

  describe('productSchema', () => {
    it('should validate a complete product object', () => {
      const validProduct = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        productName: 'Test Product',
        description: 'A test product',
        price: 99.99,
        cost: 50.00,
        image: 'https://example.com/image.jpg',
        categoryId: '123e4567-e89b-12d3-a456-426614174001',
        companyId: '123e4567-e89b-12d3-a456-426614174002',
        locationId: '123e4567-e89b-12d3-a456-426614174003',
        status: 'active',
        uom: 'pieces',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      }
      const result = schemas.product.safeParse(validProduct)
      expect(result.success).toBe(true)
    })

    it('should reject product with negative price', () => {
      const invalidProduct = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        productName: 'Test Product',
        price: -10,
        categoryId: '123e4567-e89b-12d3-a456-426614174001',
        companyId: '123e4567-e89b-12d3-a456-426614174002',
        locationId: '123e4567-e89b-12d3-a456-426614174003',
        status: 'active',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      }
      const result = schemas.product.safeParse(invalidProduct)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Price must be positive')
      }
    })
  })

  describe('createProductSchema', () => {
    it('should validate a valid create product request', () => {
      const validRequest = {
        productName: 'New Product',
        description: 'A new product',
        price: 29.99,
        cost: 15.00,
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        companyId: '123e4567-e89b-12d3-a456-426614174001',
        locationId: '123e4567-e89b-12d3-a456-426614174002',
        status: 'active',
        uom: 'pieces',
      }
      const result = schemas.createProduct.safeParse(validRequest)
      expect(result.success).toBe(true)
    })

    it('should reject request with missing required fields', () => {
      const invalidRequest = {
        description: 'A new product',
        price: 29.99,
        // missing productName, categoryId, companyId, locationId
      }
      const result = schemas.createProduct.safeParse(invalidRequest)
      expect(result.success).toBe(false)
    })
  })

  describe('loginRequestSchema', () => {
    it('should validate a valid login request', () => {
      const validRequest = {
        email: 'test@example.com',
        password: 'password123',
      }
      const result = schemas.loginRequest.safeParse(validRequest)
      expect(result.success).toBe(true)
    })

    it('should reject request with invalid email', () => {
      const invalidRequest = {
        email: 'invalid-email',
        password: 'password123',
      }
      const result = schemas.loginRequest.safeParse(invalidRequest)
      expect(result.success).toBe(false)
    })

    it('should reject request with short password', () => {
      const invalidRequest = {
        email: 'test@example.com',
        password: 'short',
      }
      const result = schemas.loginRequest.safeParse(invalidRequest)
      expect(result.success).toBe(false)
    })
  })

  describe('paginationParamsSchema', () => {
    it('should validate valid pagination params', () => {
      const validParams = {
        page: 1,
        take: 10,
        search: 'test',
        sortBy: 'name',
        sortOrder: 'asc',
      }
      const result = schemas.paginationParams.safeParse(validParams)
      expect(result.success).toBe(true)
    })

    it('should use default values when not provided', () => {
      const result = schemas.paginationParams.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.take).toBe(10)
      }
    })

    it('should reject invalid page number', () => {
      const invalidParams = {
        page: 0,
        take: 10,
      }
      const result = schemas.paginationParams.safeParse(invalidParams)
      expect(result.success).toBe(false)
    })

    it('should reject take value greater than 100', () => {
      const invalidParams = {
        page: 1,
        take: 101,
      }
      const result = schemas.paginationParams.safeParse(invalidParams)
      expect(result.success).toBe(false)
    })
  })

  describe('apiResponseSchema', () => {
    it('should validate a valid API response', () => {
      const validResponse = {
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          role: 'CASHIER',
          companyId: '123e4567-e89b-12d3-a456-426614174001',
          locationId: '123e4567-e89b-12d3-a456-426614174002',
          isEmailVerified: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        message: 'Success',
        status: 200,
      }
      const result = schemas.apiResponse(schemas.user).safeParse(validResponse)
      expect(result.success).toBe(true)
    })

    it('should reject response with invalid status', () => {
      const invalidResponse = {
        data: { id: '123', name: 'Test' },
        message: 'Success',
        status: 'invalid',
      }
      const result = schemas.apiResponse(schemas.user).safeParse(invalidResponse)
      expect(result.success).toBe(false)
    })
  })

  describe('apiErrorSchema', () => {
    it('should validate a valid API error', () => {
      const validError = {
        message: 'Error occurred',
        status: 400,
        errors: {
          field: ['Field is required'],
        },
      }
      const result = schemas.apiError.safeParse(validError)
      expect(result.success).toBe(true)
    })

    it('should validate error without optional errors field', () => {
      const validError = {
        message: 'Error occurred',
        status: 500,
      }
      const result = schemas.apiError.safeParse(validError)
      expect(result.success).toBe(true)
    })
  })
})
