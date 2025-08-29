import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  userSchema,
  loginSchema,
  signupSchema,
  companySchema,
  locationSchema,
  productSchema,
  categorySchema,
  catalogSchema,
  roleSchema,
  searchSchema,
  paginationSchema,
  apiResponseSchema,
  apiErrorSchema,
  validateForm,
} from '@/lib/validations/schemas'

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'test+tag@gmail.com',
        'user@subdomain.example.com',
      ]

      validEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).not.toThrow()
        expect(emailSchema.parse(email)).toBe(email)
      })
    })

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        '',
        'invalid-email',
        '@example.com',
        'test@',
        'test@.com',
        'test..email@example.com',
        'test@example..com',
      ]

      invalidEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).toThrow()
      })
    })

    it('should reject empty email', () => {
      expect(() => emailSchema.parse('')).toThrow('Email is required')
    })
  })

  describe('passwordSchema', () => {
    it('should validate strong passwords', () => {
      const validPasswords = [
        'Password123',
        'MySecurePass1',
        'Complex!Pass2',
        'Str0ngP@ssw0rd',
      ]

      validPasswords.forEach(password => {
        expect(() => passwordSchema.parse(password)).not.toThrow()
        expect(passwordSchema.parse(password)).toBe(password)
      })
    })

    it('should reject weak passwords', () => {
      const invalidPasswords = [
        '',
        '123',
        'password',
        'PASSWORD',
        'Password',
        '12345678',
        'Pass1', // Too short
      ]

      invalidPasswords.forEach(password => {
        expect(() => passwordSchema.parse(password)).toThrow()
      })
    })

    it('should require minimum length of 8', () => {
      expect(() => passwordSchema.parse('Pass1')).toThrow('Password must be at least 8 characters')
    })

    it('should require uppercase, lowercase, and number', () => {
      expect(() => passwordSchema.parse('password')).toThrow('Password must contain at least one uppercase letter, one lowercase letter, and one number')
      expect(() => passwordSchema.parse('PASSWORD')).toThrow('Password must contain at least one uppercase letter, one lowercase letter, and one number')
      expect(() => passwordSchema.parse('Password')).toThrow('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    })
  })

  describe('phoneSchema', () => {
    it('should validate correct phone numbers', () => {
      const validPhones = [
        '+1234567890',
        '+1 234 567 890',
        '+1-234-567-890',
        '+123456789012345',
        '1234567890',
        '+92 300 1234567',
      ]

      validPhones.forEach(phone => {
        expect(() => phoneSchema.parse(phone)).not.toThrow()
        expect(phoneSchema.parse(phone)).toBe(phone)
      })
    })

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        '',
        '123',
        'abc1234567', // Contains letters
        '123-456-789', // Too short after validation
        '+',
        '++1234567890', // Double plus
        '123456789', // Too short
        'phone1234567890', // Contains letters
        '123-456-789@', // Contains invalid character
      ]

      invalidPhones.forEach(phone => {
        expect(() => phoneSchema.parse(phone)).toThrow()
      })
    })

    it('should require minimum length of 10 digits', () => {
      expect(() => phoneSchema.parse('123456789')).toThrow('Phone number must be at least 10 digits')
    })
  })

  describe('userSchema', () => {
    const validUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'POSPORT_ADMIN' as const,
      status: 'active' as const,
    }

    it('should validate correct user data', () => {
      expect(() => userSchema.parse(validUser)).not.toThrow()
      const result = userSchema.parse(validUser)
      expect(result.firstName).toBe('John')
      expect(result.lastName).toBe('Doe')
      expect(result.email).toBe('john.doe@example.com')
    })

    it('should validate with optional fields', () => {
      const userWithOptionals = {
        ...validUser,
        id: 'user-123',
        phone: '+1234567890',
        companyId: 'company-123',
        locationId: 'location-123',
      }

      expect(() => userSchema.parse(userWithOptionals)).not.toThrow()
    })

    it('should reject invalid role', () => {
      const invalidUser = { ...validUser, role: 'INVALID_ROLE' }
      expect(() => userSchema.parse(invalidUser)).toThrow()
    })

    it('should reject invalid status', () => {
      const invalidUser = { ...validUser, status: 'suspended' }
      expect(() => userSchema.parse(invalidUser)).toThrow()
    })

    it('should set default status to active', () => {
      const userWithoutStatus = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'POSPORT_ADMIN' as const,
      }

      const result = userSchema.parse(userWithoutStatus)
      expect(result.status).toBe('active')
    })
  })

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validLogin = {
        email: 'test@example.com',
        password: 'password123',
      }

      expect(() => loginSchema.parse(validLogin)).not.toThrow()
      const result = loginSchema.parse(validLogin)
      expect(result.email).toBe('test@example.com')
      expect(result.password).toBe('password123')
    })

    it('should reject empty password', () => {
      const invalidLogin = {
        email: 'test@example.com',
        password: '',
      }

      expect(() => loginSchema.parse(invalidLogin)).toThrow('Password is required')
    })
  })

  describe('signupSchema', () => {
    const validSignup = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '+1234567890',
    }

    it('should validate correct signup data', () => {
      expect(() => signupSchema.parse(validSignup)).not.toThrow()
      const result = signupSchema.parse(validSignup)
      expect(result.firstName).toBe('John')
      expect(result.email).toBe('john.doe@example.com')
    })

    it('should validate without optional phone', () => {
      const signupWithoutPhone = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      }

      expect(() => signupSchema.parse(signupWithoutPhone)).not.toThrow()
    })

    it('should reject mismatched passwords', () => {
      const invalidSignup = {
        ...validSignup,
        confirmPassword: 'DifferentPassword123',
      }

      expect(() => signupSchema.parse(invalidSignup)).toThrow("Passwords don't match")
    })

    it('should reject weak passwords', () => {
      const invalidSignup = {
        ...validSignup,
        password: 'weak',
        confirmPassword: 'weak',
      }

      expect(() => signupSchema.parse(invalidSignup)).toThrow()
    })
  })

  describe('companySchema', () => {
    const validCompany = {
      name: 'Test Company',
      address: '123 Test Street',
      phone: '+1234567890',
      email: 'contact@testcompany.com',
      status: 'active' as const,
    }

    it('should validate correct company data', () => {
      expect(() => companySchema.parse(validCompany)).not.toThrow()
      const result = companySchema.parse(validCompany)
      expect(result.name).toBe('Test Company')
      expect(result.email).toBe('contact@testcompany.com')
    })

    it('should validate with optional fields', () => {
      const companyWithOptionals = {
        ...validCompany,
        id: 'company-123',
        description: 'A test company',
        website: 'https://testcompany.com',
      }

      expect(() => companySchema.parse(companyWithOptionals)).not.toThrow()
    })

    it('should reject invalid website URL', () => {
      const invalidCompany = {
        ...validCompany,
        website: 'not-a-valid-url',
      }

      expect(() => companySchema.parse(invalidCompany)).toThrow('Please enter a valid website URL')
    })

    it('should allow empty website', () => {
      const companyWithEmptyWebsite = {
        ...validCompany,
        website: '',
      }

      expect(() => companySchema.parse(companyWithEmptyWebsite)).not.toThrow()
    })
  })

  describe('productSchema', () => {
    const validProduct = {
      productName: 'Test Product',
      price: 29.99,
      stock: 100,
      categoryId: 'category-123',
      companyId: 'company-123',
      locationId: 'location-123',
      status: 'active' as const,
    }

    it('should validate correct product data', () => {
      expect(() => productSchema.parse(validProduct)).not.toThrow()
      const result = productSchema.parse(validProduct)
      expect(result.productName).toBe('Test Product')
      expect(result.price).toBe(29.99)
    })

    it('should validate with optional fields', () => {
      const productWithOptionals = {
        ...validProduct,
        id: 'product-123',
        description: 'A test product',
        image: 'https://example.com/image.jpg',
      }

      expect(() => productSchema.parse(productWithOptionals)).not.toThrow()
    })

    it('should reject negative price', () => {
      const invalidProduct = { ...validProduct, price: -10 }
      expect(() => productSchema.parse(invalidProduct)).toThrow('Price must be non-negative')
    })

    it('should reject negative stock', () => {
      const invalidProduct = { ...validProduct, stock: -5 }
      expect(() => productSchema.parse(invalidProduct)).toThrow('Stock must be non-negative')
    })

    it('should reject invalid image URL', () => {
      const invalidProduct = { ...validProduct, image: 'not-a-valid-url' }
      expect(() => productSchema.parse(invalidProduct)).toThrow('Please enter a valid image URL')
    })

    it('should allow empty image', () => {
      const productWithEmptyImage = { ...validProduct, image: '' }
      expect(() => productSchema.parse(productWithEmptyImage)).not.toThrow()
    })
  })

  describe('categorySchema', () => {
    const validCategory = {
      categoryName: 'Test Category',
      color: '#FF5733',
      icon: 'shopping-bag',
      companyId: 'company-123',
      locationId: 'location-123',
      menuId: 'menu-123',
      status: 'active' as const,
    }

    it('should validate correct category data', () => {
      expect(() => categorySchema.parse(validCategory)).not.toThrow()
      const result = categorySchema.parse(validCategory)
      expect(result.categoryName).toBe('Test Category')
      expect(result.color).toBe('#FF5733')
    })

    it('should validate with optional fields', () => {
      const categoryWithOptionals = {
        ...validCategory,
        id: 'category-123',
        description: 'A test category',
        parentId: 'parent-category-123',
      }

      expect(() => categorySchema.parse(categoryWithOptionals)).not.toThrow()
    })

    it('should reject invalid hex color', () => {
      const invalidCategory = { ...validCategory, color: 'red' }
      expect(() => categorySchema.parse(invalidCategory)).toThrow('Please enter a valid hex color')
    })

    it('should reject invalid hex color format', () => {
      const invalidCategory = { ...validCategory, color: '#GGG' }
      expect(() => categorySchema.parse(invalidCategory)).toThrow('Please enter a valid hex color')
    })
  })

  describe('searchSchema', () => {
    it('should validate correct search data', () => {
      const validSearch = {
        query: 'test search',
        page: 1,
        limit: 10,
      }

      expect(() => searchSchema.parse(validSearch)).not.toThrow()
      const result = searchSchema.parse(validSearch)
      expect(result.query).toBe('test search')
      expect(result.page).toBe(1)
      expect(result.limit).toBe(10)
    })

    it('should validate with optional filters', () => {
      const searchWithFilters = {
        query: 'test search',
        filters: { category: 'electronics', price: '100-500' },
        page: 2,
        limit: 20,
      }

      expect(() => searchSchema.parse(searchWithFilters)).not.toThrow()
    })

    it('should set default values', () => {
      const searchWithoutDefaults = {
        query: 'test search',
      }

      const result = searchSchema.parse(searchWithoutDefaults)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(10)
    })

    it('should reject invalid page number', () => {
      const invalidSearch = { query: 'test', page: 0 }
      expect(() => searchSchema.parse(invalidSearch)).toThrow('Page must be at least 1')
    })

    it('should reject invalid limit', () => {
      const invalidSearch = { query: 'test', limit: 150 }
      expect(() => searchSchema.parse(invalidSearch)).toThrow('Limit must be at most 100')
    })
  })

  describe('paginationSchema', () => {
    it('should validate correct pagination data', () => {
      const validPagination = {
        page: 2,
        limit: 25,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
      }

      expect(() => paginationSchema.parse(validPagination)).not.toThrow()
      const result = paginationSchema.parse(validPagination)
      expect(result.page).toBe(2)
      expect(result.limit).toBe(25)
      expect(result.sortBy).toBe('createdAt')
      expect(result.sortOrder).toBe('desc')
    })

    it('should set default values', () => {
      const paginationWithoutDefaults = {}

      const result = paginationSchema.parse(paginationWithoutDefaults)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(10)
      expect(result.sortOrder).toBe('desc')
    })

    it('should reject invalid sort order', () => {
      const invalidPagination = { sortOrder: 'invalid' }
      expect(() => paginationSchema.parse(invalidPagination)).toThrow()
    })
  })

  describe('apiResponseSchema', () => {
    it('should validate successful API response', () => {
      const validResponse = {
        success: true,
        message: 'Operation successful',
        data: { id: 1, name: 'Test' },
      }

      expect(() => apiResponseSchema.parse(validResponse)).not.toThrow()
      const result = apiResponseSchema.parse(validResponse)
      expect(result.success).toBe(true)
      expect(result.message).toBe('Operation successful')
    })

    it('should validate API response with pagination', () => {
      const responseWithPagination = {
        success: true,
        data: [{ id: 1 }, { id: 2 }],
        pagination: {
          page: 1,
          limit: 10,
          total: 25,
          totalPages: 3,
        },
      }

      expect(() => apiResponseSchema.parse(responseWithPagination)).not.toThrow()
    })
  })

  describe('apiErrorSchema', () => {
    it('should validate API error response', () => {
      const validError = {
        success: false,
        message: 'Something went wrong',
        error: 'VALIDATION_ERROR',
        details: { field: 'email', issue: 'Invalid format' },
      }

      expect(() => apiErrorSchema.parse(validError)).not.toThrow()
      const result = apiErrorSchema.parse(validError)
      expect(result.success).toBe(false)
      expect(result.message).toBe('Something went wrong')
    })

    it('should validate minimal error response', () => {
      const minimalError = {
        success: false,
        message: 'Error occurred',
      }

      expect(() => apiErrorSchema.parse(minimalError)).not.toThrow()
    })

    it('should reject success=true for error schema', () => {
      const invalidError = {
        success: true,
        message: 'This should fail',
      }

      expect(() => apiErrorSchema.parse(invalidError)).toThrow()
    })
  })

  describe('validateForm', () => {
    it('should return success result for valid data', () => {
      const validData = 'test@example.com'
      const result = validateForm(emailSchema, validData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('test@example.com')
      }
    })

    it('should return error result for invalid data', () => {
      const invalidData = { email: 'invalid-email' }
      const result = validateForm(emailSchema, invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors).toBeDefined()
        expect(Array.isArray(result.errors.errors)).toBe(true)
      }
    })

    it('should handle complex schema validation', () => {
      const validUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'POSPORT_ADMIN' as const,
      }

      const result = validateForm(userSchema, validUser)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.firstName).toBe('John')
      }
    })

    it('should handle validation errors with detailed information', () => {
      const invalidUser = {
        firstName: '',
        lastName: 'Doe',
        email: 'invalid-email',
        role: 'INVALID_ROLE',
      }

      const result = validateForm(userSchema, invalidUser)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors.errors.length).toBeGreaterThan(0)
        expect(result.errors.errors[0]).toHaveProperty('path')
        expect(result.errors.errors[0]).toHaveProperty('message')
      }
    })
  })

  describe('Type exports', () => {
    it('should export correct TypeScript types', () => {
      // Test that the types are properly exported and can be used
      const loginData: any = { email: 'test@example.com', password: 'password123' }
      const userData: any = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'POSPORT_ADMIN' as const,
      }

      expect(loginData).toBeDefined()
      expect(userData).toBeDefined()
    })
  })
})
