import { z } from 'zod'

// Base schemas
export const emailSchema = z.string().email('Invalid email address')
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
export const phoneSchema = z.string().optional()
export const idSchema = z.string().uuid('Invalid ID format')

// User schemas
export const userRoleSchema = z.enum(['POSPORT_ADMIN', 'COMPANY_OWNER', 'LOCATION_MANAGER', 'CASHIER'])
export const userStatusSchema = z.enum(['active', 'inactive'])

export const userSchema = z.object({
  id: idSchema,
  email: emailSchema,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: phoneSchema,
  role: userRoleSchema,
  companyId: idSchema.optional(),
  locationId: idSchema.optional(),
  isEmailVerified: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: emailSchema,
  phone: phoneSchema,
  role: userRoleSchema,
  companyId: idSchema.optional(),
})

export const updateUserSchema = createUserSchema.partial().extend({
  id: idSchema,
})

// Authentication schemas
export const loginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const authTokensSchema = z.object({
  access: z.object({
    token: z.string(),
    expiresIn: z.string(),
  }),
  refresh: z.object({
    token: z.string(),
    expiresIn: z.string(),
  }),
})

export const loginResponseSchema = z.object({
  data: z.object({
    user: userSchema,
    tokens: authTokensSchema,
  }),
  message: z.string(),
  status: z.number(),
})

// Company schemas
export const companySchema = z.object({
  id: idSchema,
  name: z.string().min(1, 'Company name is required'),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().optional(),
  status: userStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().optional(),
})

export const updateCompanySchema = createCompanySchema.partial().extend({
  id: idSchema,
})

// Location schemas
export const locationSchema = z.object({
  id: idSchema,
  name: z.string().min(1, 'Location name is required'),
  address: z.string().min(1, 'Address is required'),
  companyId: idSchema,
  status: userStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createLocationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  address: z.string().min(1, 'Address is required'),
  companyId: idSchema,
})

export const updateLocationSchema = createLocationSchema.partial().extend({
  id: idSchema,
})

// Catalog schemas
export const catalogSchema = z.object({
  id: idSchema,
  name: z.string().min(1, 'Catalog name is required'),
  description: z.string().optional(),
  companyId: idSchema,
  locationId: idSchema,
  status: userStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createCatalogSchema = z.object({
  name: z.string().min(1, 'Catalog name is required'),
  description: z.string().optional(),
  companyId: idSchema,
  locationId: idSchema,
})

export const updateCatalogSchema = createCatalogSchema.partial().extend({
  id: idSchema,
})

// Category schemas
export const categorySchema = z.object({
  id: idSchema,
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  catalogId: idSchema,
  status: userStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  catalogId: idSchema,
})

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: idSchema,
})

// Product schemas
export const productStatusSchema = z.enum(['active', 'inactive', 'draft'])

export const productSchema = z.object({
  id: idSchema,
  productName: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  cost: z.number().positive('Cost must be positive').optional(),
  image: z.string().url('Invalid image URL').optional(),
  categoryId: idSchema,
  companyId: idSchema,
  locationId: idSchema,
  status: productStatusSchema,
  uom: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createProductSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  cost: z.number().positive('Cost must be positive').optional(),
  image: z.string().url('Invalid image URL').optional(),
  categoryId: idSchema,
  companyId: idSchema,
  locationId: idSchema,
  status: productStatusSchema.optional(),
  uom: z.string().optional(),
})

export const updateProductSchema = createProductSchema.partial().extend({
  id: idSchema,
})

// Role schemas
export const roleSchema = z.object({
  id: idSchema,
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
  permissions: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
  permissions: z.array(z.string()),
})

export const updateRoleSchema = createRoleSchema.partial().extend({
  id: idSchema,
})

// Device schemas
export const deviceSchema = z.object({
  id: idSchema,
  name: z.string().min(1, 'Device name is required'),
  type: z.string().min(1, 'Device type is required'),
  locationId: idSchema.optional(),
  status: userStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createDeviceSchema = z.object({
  name: z.string().min(1, 'Device name is required'),
  type: z.string().min(1, 'Device type is required'),
  locationId: idSchema.optional(),
})

export const updateDeviceSchema = createDeviceSchema.partial().extend({
  id: idSchema,
})

// Cart and Order schemas
export const cartItemSchema = z.object({
  id: idSchema,
  name: z.string().min(1, 'Item name is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().positive('Quantity must be positive'),
  image: z.string().url('Invalid image URL').optional(),
})

export const orderStatusSchema = z.enum(['pending', 'completed', 'cancelled'])

export const orderSchema = z.object({
  id: idSchema,
  items: z.array(cartItemSchema),
  total: z.number().positive('Total must be positive'),
  status: orderStatusSchema,
  paymentMethod: z.string().min(1, 'Payment method is required'),
  customerId: idSchema.optional(),
  locationId: idSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// API Response schemas
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string(),
    status: z.number(),
  })

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    meta: z.object({
      page: z.number().positive(),
      take: z.number().positive(),
      total: z.number().nonnegative(),
      totalPages: z.number().nonnegative(),
    }),
    message: z.string(),
    status: z.number(),
  })

// Error schemas
export const apiErrorSchema = z.object({
  message: z.string(),
  status: z.number(),
  errors: z.record(z.array(z.string())).optional(),
})

// Pagination schemas
export const paginationParamsSchema = z.object({
  page: z.number().positive().default(1),
  take: z.number().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

// Search and Filter schemas
export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }).optional(),
})

// Form validation schemas
export const formDataSchema = z.record(z.union([z.string(), z.number(), z.boolean(), z.null()]))

// Export all schemas
export const schemas = {
  // User
  user: userSchema,
  createUser: createUserSchema,
  updateUser: updateUserSchema,
  
  // Authentication
  loginRequest: loginRequestSchema,
  loginResponse: loginResponseSchema,
  authTokens: authTokensSchema,
  
  // Company
  company: companySchema,
  createCompany: createCompanySchema,
  updateCompany: updateCompanySchema,
  
  // Location
  location: locationSchema,
  createLocation: createLocationSchema,
  updateLocation: updateLocationSchema,
  
  // Catalog
  catalog: catalogSchema,
  createCatalog: createCatalogSchema,
  updateCatalog: updateCatalogSchema,
  
  // Category
  category: categorySchema,
  createCategory: createCategorySchema,
  updateCategory: updateCategorySchema,
  
  // Product
  product: productSchema,
  createProduct: createProductSchema,
  updateProduct: updateProductSchema,
  
  // Role
  role: roleSchema,
  createRole: createRoleSchema,
  updateRole: updateRoleSchema,
  
  // Device
  device: deviceSchema,
  createDevice: createDeviceSchema,
  updateDevice: updateDeviceSchema,
  
  // Order
  order: orderSchema,
  cartItem: cartItemSchema,
  
  // API
  apiResponse: apiResponseSchema,
  paginatedResponse: paginatedResponseSchema,
  apiError: apiErrorSchema,
  
  // Utilities
  paginationParams: paginationParamsSchema,
  searchFilters: searchFiltersSchema,
  formData: formDataSchema,
}

// Type exports
export type User = z.infer<typeof userSchema>
export type CreateUserRequest = z.infer<typeof createUserSchema>
export type UpdateUserRequest = z.infer<typeof updateUserSchema>
export type LoginRequest = z.infer<typeof loginRequestSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
export type Company = z.infer<typeof companySchema>
export type CreateCompanyRequest = z.infer<typeof createCompanySchema>
export type UpdateCompanyRequest = z.infer<typeof updateCompanySchema>
export type Location = z.infer<typeof locationSchema>
export type CreateLocationRequest = z.infer<typeof createLocationSchema>
export type UpdateLocationRequest = z.infer<typeof updateLocationSchema>
export type Catalog = z.infer<typeof catalogSchema>
export type CreateCatalogRequest = z.infer<typeof createCatalogSchema>
export type UpdateCatalogRequest = z.infer<typeof updateCatalogSchema>
export type Category = z.infer<typeof categorySchema>
export type CreateCategoryRequest = z.infer<typeof createCategorySchema>
export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>
export type Product = z.infer<typeof productSchema>
export type CreateProductRequest = z.infer<typeof createProductSchema>
export type UpdateProductRequest = z.infer<typeof updateProductSchema>
export type Role = z.infer<typeof roleSchema>
export type CreateRoleRequest = z.infer<typeof createRoleSchema>
export type UpdateRoleRequest = z.infer<typeof updateRoleSchema>
export type Device = z.infer<typeof deviceSchema>
export type CreateDeviceRequest = z.infer<typeof createDeviceSchema>
export type UpdateDeviceRequest = z.infer<typeof updateDeviceSchema>
export type Order = z.infer<typeof orderSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type PaginationParams = z.infer<typeof paginationParamsSchema>
export type SearchFilters = z.infer<typeof searchFiltersSchema>
export type ApiError = z.infer<typeof apiErrorSchema>
