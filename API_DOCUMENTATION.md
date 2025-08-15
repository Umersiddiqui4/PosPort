# 📚 API Documentation

## Overview

This document provides comprehensive documentation for the Restaurant Management System API. The API follows RESTful principles and uses JSON for data exchange.

## Base URL

```
Production: https://api.posport.io/api/v1
Development: https://dev-api.posport.io/api/v1
```

## Authentication

### JWT Token Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-access-token>
```

### Token Structure

```json
{
  "access": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "15m"
  },
  "refresh": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "message": "Error description",
  "status": 400,
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

## Endpoints

### Authentication

#### POST /auth/login

Authenticate a user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "COMPANY_OWNER",
      "companyId": "company-123",
      "isEmailVerified": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "tokens": {
      "access": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expiresIn": "15m"
      },
      "refresh": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expiresIn": "7d"
      }
    }
  },
  "message": "Login successful",
  "status": 200
}
```

#### POST /auth/google/token

Exchange Google OAuth code for tokens.

**Request Body:**
```json
{
  "code": "google-oauth-code",
  "redirectUri": "http://localhost:3000/auth/callback"
}
```

**Response:** Same as login endpoint.

#### POST /auth/refresh

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "data": {
    "access": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "15m"
    }
  },
  "message": "Token refreshed successfully",
  "status": 200
}
```

#### POST /auth/logout

Logout user and invalidate tokens.

**Response:**
```json
{
  "message": "Logged out successfully",
  "status": 200
}
```

### User Management

#### GET /users

Get all users with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for name or email
- `role` (string): Filter by user role
- `companyId` (string): Filter by company ID

**Response:**
```json
{
  "data": [
    {
      "id": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "COMPANY_OWNER",
      "companyId": "company-123",
      "isEmailVerified": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "message": "Users retrieved successfully",
  "status": 200
}
```

#### GET /users/:id

Get a specific user by ID.

**Response:**
```json
{
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "COMPANY_OWNER",
    "companyId": "company-123",
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "User retrieved successfully",
  "status": 200
}
```

#### POST /users

Create a new user.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "CASHIER",
  "companyId": "company-123",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "id": "user-456",
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "CASHIER",
    "companyId": "company-123",
    "isEmailVerified": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "User created successfully",
  "status": 201
}
```

#### PUT /users/:id

Update an existing user.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "LOCATION_MANAGER"
}
```

**Response:**
```json
{
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "role": "LOCATION_MANAGER",
    "companyId": "company-123",
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  },
  "message": "User updated successfully",
  "status": 200
}
```

#### DELETE /users/:id

Delete a user.

**Response:**
```json
{
  "message": "User deleted successfully",
  "status": 200
}
```

### Company Management

#### GET /companies

Get all companies with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for company name

**Response:**
```json
{
  "data": [
    {
      "id": "company-123",
      "name": "Pizza Palace Inc.",
      "email": "contact@pizzapalace.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  },
  "message": "Companies retrieved successfully",
  "status": 200
}
```

#### GET /companies/:id

Get a specific company by ID.

**Response:**
```json
{
  "data": {
    "id": "company-123",
    "name": "Pizza Palace Inc.",
    "email": "contact@pizzapalace.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Company retrieved successfully",
  "status": 200
}
```

#### POST /companies

Create a new company.

**Request Body:**
```json
{
  "name": "New Restaurant Corp.",
  "email": "contact@newrestaurant.com",
  "phone": "+1234567890",
  "address": "456 Oak Ave"
}
```

**Response:**
```json
{
  "data": {
    "id": "company-456",
    "name": "New Restaurant Corp.",
    "email": "contact@newrestaurant.com",
    "phone": "+1234567890",
    "address": "456 Oak Ave",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Company created successfully",
  "status": 201
}
```

#### PUT /companies/:id

Update an existing company.

**Request Body:**
```json
{
  "name": "Updated Restaurant Corp.",
  "phone": "+1987654321"
}
```

**Response:**
```json
{
  "data": {
    "id": "company-123",
    "name": "Updated Restaurant Corp.",
    "email": "contact@newrestaurant.com",
    "phone": "+1987654321",
    "address": "456 Oak Ave",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  },
  "message": "Company updated successfully",
  "status": 200
}
```

#### DELETE /companies/:id

Delete a company.

**Response:**
```json
{
  "message": "Company deleted successfully",
  "status": 200
}
```

### Location Management

#### GET /locations

Get all locations with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for location name
- `companyId` (string): Filter by company ID
- `userId` (string): Filter by user ID

**Response:**
```json
{
  "data": [
    {
      "id": "location-123",
      "locationName": "Pizza Palace Downtown",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "postalCode": "10001",
      "phone": "+1234567890",
      "email": "downtown@pizzapalace.com",
      "qrCode": "LOC-1234567890-ABC123",
      "companyId": "company-123",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "message": "Locations retrieved successfully",
  "status": 200
}
```

#### GET /locations/:id

Get a specific location by ID.

**Response:**
```json
{
  "data": {
    "id": "location-123",
    "locationName": "Pizza Palace Downtown",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10001",
    "phone": "+1234567890",
    "email": "downtown@pizzapalace.com",
    "qrCode": "LOC-1234567890-ABC123",
    "companyId": "company-123",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Location retrieved successfully",
  "status": 200
}
```

#### POST /locations

Create a new location.

**Request Body:**
```json
{
  "locationName": "Pizza Palace Uptown",
  "address": "456 Oak Ave",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "postalCode": "10002",
  "phone": "+1234567890",
  "email": "uptown@pizzapalace.com",
  "companyId": "company-123"
}
```

**Response:**
```json
{
  "data": {
    "id": "location-456",
    "locationName": "Pizza Palace Uptown",
    "address": "456 Oak Ave",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10002",
    "phone": "+1234567890",
    "email": "uptown@pizzapalace.com",
    "qrCode": "LOC-1234567890-DEF456",
    "companyId": "company-123",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Location created successfully",
  "status": 201
}
```

#### PUT /locations/:id

Update an existing location.

**Request Body:**
```json
{
  "locationName": "Pizza Palace Downtown Updated",
  "phone": "+1987654321"
}
```

**Response:**
```json
{
  "data": {
    "id": "location-123",
    "locationName": "Pizza Palace Downtown Updated",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10001",
    "phone": "+1987654321",
    "email": "downtown@pizzapalace.com",
    "qrCode": "LOC-1234567890-ABC123",
    "companyId": "company-123",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  },
  "message": "Location updated successfully",
  "status": 200
}
```

#### DELETE /locations/:id

Delete a location.

**Response:**
```json
{
  "message": "Location deleted successfully",
  "status": 200
}
```

### Product Management

#### GET /products

Get all products with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for product name
- `categoryId` (string): Filter by category ID
- `locationId` (string): Filter by location ID

**Response:**
```json
{
  "data": [
    {
      "id": "product-123",
      "name": "Margherita Pizza",
      "description": "Classic tomato and mozzarella pizza",
      "price": 12.99,
      "categoryId": "category-123",
      "locationId": "location-123",
      "image": "https://example.com/pizza.jpg",
      "isAvailable": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "message": "Products retrieved successfully",
  "status": 200
}
```

#### GET /products/:id

Get a specific product by ID.

**Response:**
```json
{
  "data": {
    "id": "product-123",
    "name": "Margherita Pizza",
    "description": "Classic tomato and mozzarella pizza",
    "price": 12.99,
    "categoryId": "category-123",
    "locationId": "location-123",
    "image": "https://example.com/pizza.jpg",
    "isAvailable": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Product retrieved successfully",
  "status": 200
}
```

#### POST /products

Create a new product.

**Request Body:**
```json
{
  "name": "Pepperoni Pizza",
  "description": "Spicy pepperoni pizza with cheese",
  "price": 14.99,
  "categoryId": "category-123",
  "locationId": "location-123",
  "image": "https://example.com/pepperoni.jpg"
}
```

**Response:**
```json
{
  "data": {
    "id": "product-456",
    "name": "Pepperoni Pizza",
    "description": "Spicy pepperoni pizza with cheese",
    "price": 14.99,
    "categoryId": "category-123",
    "locationId": "location-123",
    "image": "https://example.com/pepperoni.jpg",
    "isAvailable": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Product created successfully",
  "status": 201
}
```

#### PUT /products/:id

Update an existing product.

**Request Body:**
```json
{
  "name": "Pepperoni Pizza Deluxe",
  "price": 16.99,
  "isAvailable": false
}
```

**Response:**
```json
{
  "data": {
    "id": "product-456",
    "name": "Pepperoni Pizza Deluxe",
    "description": "Spicy pepperoni pizza with cheese",
    "price": 16.99,
    "categoryId": "category-123",
    "locationId": "location-123",
    "image": "https://example.com/pepperoni.jpg",
    "isAvailable": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  },
  "message": "Product updated successfully",
  "status": 200
}
```

#### DELETE /products/:id

Delete a product.

**Response:**
```json
{
  "message": "Product deleted successfully",
  "status": 200
}
```

### Category Management

#### GET /categories

Get all categories with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for category name
- `catalogId` (string): Filter by catalog ID

**Response:**
```json
{
  "data": [
    {
      "id": "category-123",
      "name": "Pizzas",
      "description": "All pizza varieties",
      "catalogId": "catalog-123",
      "image": "https://example.com/pizza-category.jpg",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2
  },
  "message": "Categories retrieved successfully",
  "status": 200
}
```

#### GET /categories/:id

Get a specific category by ID.

**Response:**
```json
{
  "data": {
    "id": "category-123",
    "name": "Pizzas",
    "description": "All pizza varieties",
    "catalogId": "catalog-123",
    "image": "https://example.com/pizza-category.jpg",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Category retrieved successfully",
  "status": 200
}
```

#### POST /categories

Create a new category.

**Request Body:**
```json
{
  "name": "Beverages",
  "description": "All drink options",
  "catalogId": "catalog-123",
  "image": "https://example.com/beverages.jpg"
}
```

**Response:**
```json
{
  "data": {
    "id": "category-456",
    "name": "Beverages",
    "description": "All drink options",
    "catalogId": "catalog-123",
    "image": "https://example.com/beverages.jpg",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Category created successfully",
  "status": 201
}
```

#### PUT /categories/:id

Update an existing category.

**Request Body:**
```json
{
  "name": "Hot Beverages",
  "description": "Coffee, tea, and hot drinks"
}
```

**Response:**
```json
{
  "data": {
    "id": "category-456",
    "name": "Hot Beverages",
    "description": "Coffee, tea, and hot drinks",
    "catalogId": "catalog-123",
    "image": "https://example.com/beverages.jpg",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  },
  "message": "Category updated successfully",
  "status": 200
}
```

#### DELETE /categories/:id

Delete a category.

**Response:**
```json
{
  "message": "Category deleted successfully",
  "status": 200
}
```

### Catalog Management

#### GET /catalogs

Get all catalogs with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for catalog name
- `userId` (string): Filter by user ID

**Response:**
```json
{
  "data": [
    {
      "id": "catalog-123",
      "name": "Pizza Palace Menu",
      "description": "Complete menu for Pizza Palace",
      "userId": "user-123",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  },
  "message": "Catalogs retrieved successfully",
  "status": 200
}
```

#### GET /catalogs/:id

Get a specific catalog by ID.

**Response:**
```json
{
  "data": {
    "id": "catalog-123",
    "name": "Pizza Palace Menu",
    "description": "Complete menu for Pizza Palace",
    "userId": "user-123",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Catalog retrieved successfully",
  "status": 200
}
```

#### POST /catalogs

Create a new catalog.

**Request Body:**
```json
{
  "name": "New Restaurant Menu",
  "description": "Menu for the new restaurant",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "data": {
    "id": "catalog-456",
    "name": "New Restaurant Menu",
    "description": "Menu for the new restaurant",
    "userId": "user-123",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Catalog created successfully",
  "status": 201
}
```

#### PUT /catalogs/:id

Update an existing catalog.

**Request Body:**
```json
{
  "name": "Updated Restaurant Menu",
  "description": "Updated menu description"
}
```

**Response:**
```json
{
  "data": {
    "id": "catalog-456",
    "name": "Updated Restaurant Menu",
    "description": "Updated menu description",
    "userId": "user-123",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  },
  "message": "Catalog updated successfully",
  "status": 200
}
```

#### DELETE /catalogs/:id

Delete a catalog.

**Response:**
```json
{
  "message": "Catalog deleted successfully",
  "status": 200
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **File upload endpoints**: 10 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

All list endpoints support pagination with the following parameters:

- `page`: Page number (starts from 1)
- `limit`: Number of items per page (max 100)

Response includes pagination metadata:

```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Filtering and Search

Most endpoints support filtering and search:

- `search`: Text search across relevant fields
- `sortBy`: Field to sort by
- `sortOrder`: `asc` or `desc`
- Field-specific filters (e.g., `role`, `status`, `companyId`)

## File Upload

### Image Upload

Upload product images and category images:

**POST /upload/image**

**Request:**
```
Content-Type: multipart/form-data

file: [image file]
type: "product" | "category" | "user"
```

**Response:**
```json
{
  "data": {
    "url": "https://cdn.example.com/images/product-123.jpg",
    "filename": "product-123.jpg",
    "size": 1024000,
    "mimeType": "image/jpeg"
  },
  "message": "Image uploaded successfully",
  "status": 200
}
```

## Webhooks

The API supports webhooks for real-time notifications:

### Webhook Events

- `user.created`
- `user.updated`
- `user.deleted`
- `order.created`
- `order.updated`
- `order.completed`

### Webhook Configuration

**POST /webhooks**

**Request Body:**
```json
{
  "url": "https://your-app.com/webhooks",
  "events": ["user.created", "order.completed"],
  "secret": "webhook-secret-key"
}
```

**Response:**
```json
{
  "data": {
    "id": "webhook-123",
    "url": "https://your-app.com/webhooks",
    "events": ["user.created", "order.completed"],
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "Webhook created successfully",
  "status": 201
}
```

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @posport/api-client
```

```typescript
import { PosPortAPI } from '@posport/api-client';

const api = new PosPortAPI({
  baseURL: 'https://dev-api.posport.io/api/v1',
  token: 'your-access-token'
});

// Get users
const users = await api.users.list();

// Create a product
const product = await api.products.create({
  name: 'New Product',
  price: 9.99,
  categoryId: 'category-123'
});
```

### Python

```bash
pip install posport-api
```

```python
from posport_api import PosPortAPI

api = PosPortAPI(
    base_url='https://dev-api.posport.io/api/v1',
    token='your-access-token'
)

# Get users
users = api.users.list()

# Create a product
product = api.products.create({
    'name': 'New Product',
    'price': 9.99,
    'categoryId': 'category-123'
})
```

## Support

For API support and questions:

- **Documentation**: [https://docs.posport.io](https://docs.posport.io)
- **API Status**: [https://status.posport.io](https://status.posport.io)
- **Support Email**: api-support@posport.io
- **Developer Discord**: [https://discord.gg/posport](https://discord.gg/posport)

---

**Last Updated**: January 2024  
**API Version**: v1  
**Documentation Version**: 1.0.0
