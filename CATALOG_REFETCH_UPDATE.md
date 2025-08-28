# Catalog Refetch Update Summary

## Issue Description
When products are created, edited, or deleted, the application was refetching the separate products API instead of the catalog API. Since the catalog now contains all product data in a nested structure, we need to refetch the catalog API to get the updated data.

## Changes Made

### 1. **Updated Product Hooks** (`hooks/use-products.ts`)

#### Before:
```typescript
// Create product
const createProductMutation = useMutation({
  mutationFn: (productData: CreateProductRequest) => createProduct(productData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] })
    // ...
  },
})

// Update product
const updateProductMutation = useMutation({
  mutationFn: ({ id, ...productData }: { id: string } & UpdateProductRequest) => updateProduct(id, productData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] })
    // ...
  },
})

// Delete product
const deleteProductMutation = useMutation({
  mutationFn: ({ id, attachments }: { id: string; attachments?: Array<{ id: string }> }) => deleteProduct(id, attachments),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] })
    // ...
  },
})
```

#### After:
```typescript
// Create product
const createProductMutation = useMutation({
  mutationFn: (productData: CreateProductRequest) => createProduct(productData),
  onSuccess: () => {
    // Invalidate catalog queries instead of product queries since catalog contains all product data
    queryClient.invalidateQueries({ queryKey: ["catalog"] })
    // ...
  },
})

// Update product
const updateProductMutation = useMutation({
  mutationFn: ({ id, ...productData }: { id: string } & UpdateProductRequest) => updateProduct(id, productData),
  onSuccess: () => {
    // Invalidate catalog queries instead of product queries since catalog contains all product data
    queryClient.invalidateQueries({ queryKey: ["catalog"] })
    // ...
  },
})

// Delete product
const deleteProductMutation = useMutation({
  mutationFn: ({ id, attachments }: { id: string; attachments?: Array<{ id: string }> }) => deleteProduct(id, attachments),
  onSuccess: () => {
    // Invalidate catalog queries instead of product queries since catalog contains all product data
    queryClient.invalidateQueries({ queryKey: ["catalog"] })
    // ...
  },
})
```

### 2. **Updated Product Form Component** (`components/product-form.tsx`)

#### Before:
```typescript
// Refetch product data to get updated information including new attachment
if (createdProductId) {
  // For both creating and editing, invalidate queries to refetch updated data
  queryClient.invalidateQueries({ queryKey: ["product", createdProductId] })
  queryClient.invalidateQueries({ queryKey: ["products"] })
  console.log('Product data refetched after image upload')
}
```

#### After:
```typescript
// Refetch catalog data to get updated information including new attachment
if (createdProductId) {
  // For both creating and editing, invalidate catalog queries to refetch updated data
  queryClient.invalidateQueries({ queryKey: ["catalog"] })
  console.log('Catalog data refetched after image upload')
}
```

### 3. **Updated Catalog Change Listener** (`hooks/use-catalog-change-listener.ts`)

#### Before:
```typescript
const handleCatalogChange = (event: CustomEvent) => {
  console.log('Catalog change listener: Invalidating queries', event.detail)
  
  // Invalidate all related queries immediately
  queryClient.invalidateQueries({ queryKey: ['combos'] })
  queryClient.invalidateQueries({ queryKey: ['products'] })
  queryClient.invalidateQueries({ queryKey: ['categories'] })
  queryClient.invalidateQueries({ queryKey: ['catalogs'] })
  
  // Force refetch critical data
  queryClient.refetchQueries({ queryKey: ['combos'] })
  queryClient.refetchQueries({ queryKey: ['products'] })
}

const handleCategoryChange = (event: CustomEvent) => {
  console.log('Category change listener: Invalidating queries', event.detail)
  
  // Invalidate product-related queries when category changes
  queryClient.invalidateQueries({ queryKey: ['products'] })
  queryClient.refetchQueries({ queryKey: ['products'] })
}
```

#### After:
```typescript
const handleCatalogChange = (event: CustomEvent) => {
  console.log('Catalog change listener: Invalidating queries', event.detail)
  
  // Invalidate all related queries immediately
  queryClient.invalidateQueries({ queryKey: ['combos'] })
  queryClient.invalidateQueries({ queryKey: ['catalog'] }) // Invalidate catalog instead of products
  queryClient.invalidateQueries({ queryKey: ['categories'] })
  queryClient.invalidateQueries({ queryKey: ['catalogs'] })
  
  // Force refetch critical data
  queryClient.refetchQueries({ queryKey: ['combos'] })
  queryClient.refetchQueries({ queryKey: ['catalog'] }) // Refetch catalog instead of products
}

const handleCategoryChange = (event: CustomEvent) => {
  console.log('Category change listener: Invalidating queries', event.detail)
  
  // Invalidate catalog queries when category changes since catalog contains all product data
  queryClient.invalidateQueries({ queryKey: ['catalog'] })
  queryClient.refetchQueries({ queryKey: ['catalog'] })
}
```

### 4. **Updated Catalog Context** (`lib/contexts/CatalogContext.tsx`)

#### Before:
```typescript
const handleCatalogChange = (event: CustomEvent) => {
  console.log("CatalogContext: Received catalog change event", event.detail)
  // Invalidate all related queries
  if (typeof window !== 'undefined' && window.queryClient) {
    window.queryClient.invalidateQueries({ queryKey: ['combos'] })
    window.queryClient.invalidateQueries({ queryKey: ['products'] })
    window.queryClient.invalidateQueries({ queryKey: ['categories'] })
  }
}
```

#### After:
```typescript
const handleCatalogChange = (event: CustomEvent) => {
  console.log("CatalogContext: Received catalog change event", event.detail)
  // Invalidate all related queries
  if (typeof window !== 'undefined' && window.queryClient) {
    window.queryClient.invalidateQueries({ queryKey: ['combos'] })
    window.queryClient.invalidateQueries({ queryKey: ['catalog'] }) // Invalidate catalog instead of products
    window.queryClient.invalidateQueries({ queryKey: ['categories'] })
  }
}
```

### 5. **Updated Product List Page** (`pages/product-list-page.tsx`)

#### Before:
```typescript
const mutation = useMutation({
  mutationFn: addProductApi,
  onSuccess: () => {
    toast({ title: "Product added", description: "Product has been added successfully." });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    // ...
  },
})
```

#### After:
```typescript
const mutation = useMutation({
  mutationFn: addProductApi,
  onSuccess: () => {
    toast({ title: "Product added", description: "Product has been added successfully." });
    queryClient.invalidateQueries({ queryKey: ["catalog"] }); // Invalidate catalog instead of products
    // ...
  },
})
```

## Benefits of These Changes

1. **Consistent Data Source**: All product data now comes from the catalog API, ensuring consistency
2. **Reduced API Calls**: No need to make separate calls to refresh product data
3. **Better Performance**: Single catalog refetch provides all necessary data
4. **Simplified State Management**: Catalog context handles all product-related data updates

## Expected Behavior

When products are created, edited, or deleted:

1. **Product Creation**: Catalog API is refetched, new product appears in the catalog data
2. **Product Update**: Catalog API is refetched, updated product data is reflected
3. **Product Deletion**: Catalog API is refetched, deleted product is removed from catalog data
4. **Image Upload**: Catalog API is refetched, new image attachment is included in product data

## Testing Scenarios

1. **Create a new product** → Verify catalog data is refreshed and new product appears
2. **Edit an existing product** → Verify catalog data is refreshed and changes are reflected
3. **Delete a product** → Verify catalog data is refreshed and product is removed
4. **Upload product image** → Verify catalog data is refreshed and image attachment is included

## Notes

- The old separate products API calls are still available for backward compatibility
- All product operations now properly refresh the catalog data
- The catalog context will automatically update the UI when catalog data changes
- This ensures that the nested structure is always up-to-date with the latest changes

