// User and Authentication Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  companyId?: string
  locationId?: string
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

export type UserRole = 'POSPORT_ADMIN' | 'COMPANY_OWNER' | 'LOCATION_MANAGER' | 'CASHIER'

export interface AuthTokens {
  access: {
    token: string
    expiresIn: string
  }
  refresh: {
    token: string
    expiresIn: string
  }
}

// API Token interface (matches actual API response)
export interface ApiToken {
  token: string
  expires: string
}

export interface ApiAuthTokens {
  access: ApiToken
  refresh: ApiToken
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  data: {
    user: User
    tokens: AuthTokens
  }
  message: string
  status: number
}

// Partial user type for login responses that might not include all fields
export interface PartialUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  role?: UserRole
  companyId?: string
  locationId?: string
  isEmailVerified?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface PartialLoginResponse {
  data: {
    user: PartialUser
    tokens: AuthTokens
  }
  message: string
  status: number
}

// API Login Response (matches actual API response)
export interface ApiLoginResponse {
  data: {
    user: PartialUser
    tokens: ApiAuthTokens
  }
  message?: string
  status?: number
}

// Company Types
export interface Company {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// Location Types
export interface Location {
  id: string
  name: string
  address: string
  companyId: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// Catalog Types
export interface Catalog {
  id: string
  name: string
  description?: string
  companyId: string
  locationId: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// Category Types
export interface Category {
  id: string
  name: string
  description?: string
  catalogId: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// Product Types
export interface Product {
  id: string
  productName: string
  description?: string
  price: number
  cost?: number
  image?: string
  categoryId: string
  companyId: string
  locationId: string
  status: 'active' | 'inactive' | 'draft'
  uom?: string
  createdAt: string
  updatedAt: string
}

export interface CreateProductRequest {
  productName: string
  description?: string
  price: number
  cost?: number
  image?: string
  categoryId: string
  companyId: string
  locationId: string
  status?: 'active' | 'inactive' | 'draft'
  uom?: string
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string
}

// Role Types
export interface Role {
  id: string
  name: string
  description?: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

// Device Types
export interface Device {
  id: string
  name: string
  type: string
  locationId?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// Cart and Order Types
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  paymentMethod: string
  customerId?: string
  locationId: string
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    take: number
    total: number
    totalPages: number
  }
  message: string
  status: number
}

// Error Types
export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

// Form Types
export interface FormData {
  [key: string]: string | number | boolean | null
}

// UI Component Props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export interface ErrorProps extends BaseComponentProps {
  error?: Error | string
  onRetry?: () => void
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'

// View Types
export type ViewMode = 'grid' | 'list'
export type ViewType = 'products' | 'categories' | 'catalogs'

// Search and Filter Types
export interface SearchFilters {
  query?: string
  category?: string
  status?: string
  dateRange?: {
    start: string
    end: string
  }
}

// Pagination Types
export interface PaginationParams {
  page: number
  take: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Notification Types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

// Modal Types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Table Types
export interface TableColumn<T> {
  key: keyof T
  header: string
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  error?: Error | string
  onRowClick?: (row: T) => void
  pagination?: PaginationParams
  onPaginationChange?: (params: PaginationParams) => void
}

// Hook Return Types
export interface UseQueryResult<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export interface UseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => void
  mutateAsync: (variables: TVariables) => Promise<TData>
  isLoading: boolean
  error: Error | null
  isSuccess: boolean
  isError: boolean
  reset: () => void
}
