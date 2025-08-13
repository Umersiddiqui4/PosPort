import { z } from 'zod';

// Base schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
  .min(10, 'Phone number must be at least 10 digits');

// User schemas
export const userSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  role: z.enum(['POSPORT_ADMIN', 'COMPANY_OWNER', 'LOCATION_MANAGER', 'CASHIER']),
  companyId: z.string().optional(),
  locationId: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  phone: phoneSchema.optional(),
  companyName: z.string().min(1, 'Company name is required').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Company schemas
export const companySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  address: z.string().min(1, 'Address is required').max(200, 'Address must be less than 200 characters'),
  phone: phoneSchema,
  email: emailSchema,
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']).default('active'),
});

// Location schemas
export const locationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Location name is required').max(100, 'Location name must be less than 100 characters'),
  address: z.string().min(1, 'Address is required').max(200, 'Address must be less than 200 characters'),
  phone: phoneSchema,
  email: emailSchema.optional(),
  companyId: z.string().min(1, 'Company is required'),
  status: z.enum(['active', 'inactive']).default('active'),
});

// Product schemas
export const productSchema = z.object({
  id: z.string().optional(),
  productName: z.string().min(1, 'Product name is required').max(100, 'Product name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  price: z.number().min(0, 'Price must be non-negative').max(999999.99, 'Price must be less than 1,000,000'),
  stock: z.number().int().min(0, 'Stock must be non-negative').max(999999, 'Stock must be less than 1,000,000'),
  categoryId: z.string().min(1, 'Category is required'),
  companyId: z.string().min(1, 'Company is required'),
  locationId: z.string().min(1, 'Location is required'),
  image: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']).default('active'),
});

// Category schemas
export const categorySchema = z.object({
  id: z.string().optional(),
  categoryName: z.string().min(1, 'Category name is required').max(50, 'Category name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
  icon: z.string().min(1, 'Icon is required'),
  parentId: z.string().optional(),
  companyId: z.string().min(1, 'Company is required'),
  locationId: z.string().min(1, 'Location is required'),
  menuId: z.string().min(1, 'Menu is required'),
  status: z.enum(['active', 'inactive']).default('active'),
});

// Catalog schemas
export const catalogSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Catalog name is required').max(100, 'Catalog name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  companyId: z.string().min(1, 'Company is required'),
  locationId: z.string().min(1, 'Location is required'),
  status: z.enum(['active', 'inactive']).default('active'),
});

// Role schemas
export const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Role name is required').max(50, 'Role name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  status: z.enum(['active', 'inactive']).default('active'),
});

// Search schemas
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query must be less than 100 characters'),
  filters: z.record(z.any()).optional(),
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit must be at most 100').default(10),
});

// Pagination schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit must be at most 100').default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// API Response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).optional(),
});

// Error schemas
export const apiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string().optional(),
  details: z.record(z.any()).optional(),
});

// Form validation helpers
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
};

// Type exports
export type User = z.infer<typeof userSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type Company = z.infer<typeof companySchema>;
export type Location = z.infer<typeof locationSchema>;
export type Product = z.infer<typeof productSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Catalog = z.infer<typeof catalogSchema>;
export type Role = z.infer<typeof roleSchema>;
export type SearchParams = z.infer<typeof searchSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type ApiResponse<T = any> = z.infer<typeof apiResponseSchema> & { data?: T };
export type ApiError = z.infer<typeof apiErrorSchema>;
