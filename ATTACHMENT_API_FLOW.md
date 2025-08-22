# Attachment API Flow Implementation

## Overview

The Attachment API flow allows users to upload images and documents for Products, Catalogs, Categories, Users, and Companies. The process follows a specific workflow where items are first created, then users are prompted to upload attachments.

## API Endpoint

```
POST https://dev-api.posport.io/api/v1/attachments
```

## Request Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `tenantId` | string | Company ID | Yes |
| `entityId` | string | Product, Catalog, or User ID | Yes |
| `entityType` | string | Type of entity: `catalog`, `product`, `product_category`, `user`, `company` | Yes |
| `category` | string | Attachment category: `catalog_banner`, `category_image`, `product_image`, `user_profile` | Yes |
| `file` | File | Image or document file | Yes |

## Implementation Components

### 1. Attachment API Service (`lib/Api/uploadAttachment.ts`)

```typescript
export interface UploadAttachmentRequest {
  tenantId: string; // companyId
  entityId: string; // product, catalog, or user id
  entityType: "catalog" | "product" | "product_category" | "user" | "company";
  category: "catalog_banner" | "category_image" | "product_image" | "user_profile";
  file: File;
}
```

### 2. Attachment Hook (`hooks/use-attachments.ts`)

Provides mutation functionality for uploading attachments with proper error handling and success notifications.

### 3. File Upload Component (`components/ui/file-upload.tsx`)

A reusable component that handles:
- Drag and drop file selection
- File type validation (images only)
- File size validation (5MB limit)
- Image preview
- File removal

### 4. Success Upload Popup (`components/ui/success-upload-popup.tsx`)

A modal dialog that appears after successful item creation, prompting users to upload an image.

## Flow Implementation

### Product Creation Flow

1. **Create Product**: User fills out product form and submits
2. **Success Response**: Product is created and response contains product ID and name
3. **Upload Prompt**: Success popup appears asking "Do you want to upload a photo?"
4. **File Selection**: User can drag/drop or click to select an image
5. **Upload**: File is uploaded to the Attachment API
6. **Update Product**: Product is updated with the uploaded image URL

### Catalog Creation Flow

1. **Create Catalog**: User fills out catalog form and submits
2. **Success Response**: Catalog is created and response contains catalog ID and name
3. **Upload Prompt**: Success popup appears asking "Do you want to upload a photo?"
4. **File Selection**: User can drag/drop or click to select an image
5. **Upload**: File is uploaded to the Attachment API with `category: "catalog_banner"`

### Category Creation Flow

1. **Create Category**: User fills out category form and submits
2. **Success Response**: Category is created and response contains category ID and name
3. **Upload Prompt**: Success popup appears asking "Do you want to upload a photo?"
4. **File Selection**: User can drag/drop or click to select an image
5. **Upload**: File is uploaded to the Attachment API with `category: "category_image"`

## File Validation

- **File Type**: Only image files (PNG, JPG, GIF)
- **File Size**: Maximum 5MB
- **Preview**: Real-time image preview before upload

## Error Handling

- File type validation with user-friendly error messages
- File size validation with size limit display
- Network error handling with toast notifications
- Upload progress indication

## Usage Examples

### Product Form Integration

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // ... form validation
  
  if (isEditing) {
    await updateProduct.mutateAsync(productData)
    onSuccess?.()
  } else {
    const response = await createProduct.mutateAsync(productData)
    setCreatedProductId(response.data.id)
    setCreatedProductName(response.data.name)
    setShowUploadPopup(true)
  }
}
```

### Upload Success Handler

```typescript
const handleUploadSuccess = (fileUrl: string) => {
  if (createdProductId) {
    updateProduct.mutate({
      id: createdProductId,
      image: fileUrl,
    })
  }
  onSuccess?.()
}
```

## API Response Format

```typescript
export interface UploadAttachmentResponse {
  data: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    entityId: string;
    entityType: string;
    category: string;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}
```

## Supported Entity Types and Categories

| Entity Type | Category | Description |
|-------------|----------|-------------|
| `product` | `product_image` | Product photos |
| `catalog` | `catalog_banner` | Catalog banner images |
| `product_category` | `category_image` | Category images |
| `user` | `user_profile` | User profile pictures |
| `company` | `company_logo` | Company logos |

## Security Considerations

- File type validation on both client and server
- File size limits to prevent abuse
- Proper authentication and authorization
- Secure file storage and access

## Future Enhancements

- Support for multiple file uploads
- Image cropping and editing
- Document upload support (PDF, DOC, etc.)
- Bulk upload functionality
- Image optimization and compression
