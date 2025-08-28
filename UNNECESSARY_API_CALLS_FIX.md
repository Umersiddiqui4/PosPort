# Unnecessary API Calls Fix Summary

## Issue Description
When selecting a category in the cashier page, the URL was changing but unnecessary API calls were being made, including some with `xhr.js` as the initiator. This was causing performance issues and potential data inconsistencies.

## Root Causes Identified

### 1. **Category Change Event Dispatching**
- The `updateCategory` function was dispatching a `categoryChanged` event
- This event was triggering the catalog change listener to invalidate and refetch queries
- Category changes don't need to trigger API calls since they just filter existing catalog data

### 2. **Axios Interceptor Loop**
- The token refresh logic in axios interceptors was using `api(originalRequest)` instead of `axios(originalRequest)`
- This was causing interceptor loops and duplicate API calls

### 3. **Unnecessary Query Invalidation**
- Category changes were triggering catalog query invalidation
- This was causing the catalog data to be refetched unnecessarily

## Fixes Applied

### 1. **Removed Category Change Event Dispatching** (`lib/contexts/CatalogContext.tsx`)

#### Before:
```typescript
const updateCategory = useCallback((categoryId: string, categoryName: string) => {
  // ...
  window.dispatchEvent(new CustomEvent('categoryChanged', { 
    detail: { 
      categoryId: actualCategoryId,
      categoryName,
      catalogId: selectedCatalog,
      locationId: catalogData?.locationId
    } 
  }))
  // ...
}, [selectedCatalog, catalogData?.locationId])
```

#### After:
```typescript
const updateCategory = useCallback((categoryId: string, categoryName: string) => {
  // ...
  // Update URL only - no need to dispatch events or trigger API calls for category changes
  // ...
}, [selectedCatalog])
```

### 2. **Simplified Catalog Change Listener** (`hooks/use-catalog-change-listener.ts`)

#### Before:
```typescript
const handleCategoryChange = (event: CustomEvent) => {
  console.log('Category change listener: Invalidating queries', event.detail)
  
  // Invalidate catalog queries when category changes since catalog contains all product data
  queryClient.invalidateQueries({ queryKey: ['catalog'] })
  queryClient.refetchQueries({ queryKey: ['catalog'] })
}

// Add event listeners
window.addEventListener('catalogChanged', handleCatalogChange as EventListener)
window.addEventListener('categoryChanged', handleCategoryChange as EventListener)
```

#### After:
```typescript
// Add event listener for catalog changes only
window.addEventListener('catalogChanged', handleCatalogChange as EventListener)
```

### 3. **Fixed Axios Interceptor Loop** (`utils/axios.ts`)

#### Before:
```typescript
originalRequest.headers["Authorization"] = `Bearer ${access.token}`;
return api(originalRequest);
```

#### After:
```typescript
originalRequest.headers["Authorization"] = `Bearer ${access.token}`;
// Use axios directly instead of api to avoid interceptor loops
return axios(originalRequest);
```

### 4. **Added API Request Debugging** (`utils/axios.ts`)

Added logging to track API requests:
```typescript
// Debug: Log API requests to help identify unnecessary calls
console.log('API Request:', { 
  method: config.method?.toUpperCase(), 
  url: config.url,
  timestamp: new Date().toISOString()
});
```

## Expected Behavior After Fixes

### Category Selection:
1. **URL Updates**: URL changes to reflect the selected category
2. **No API Calls**: No unnecessary API calls are made
3. **UI Updates**: Products are filtered client-side using existing catalog data
4. **Performance**: Faster response time since no network requests are needed

### Catalog Selection:
1. **API Call**: Single catalog API call is made to fetch new data
2. **Data Update**: Catalog data is refreshed with new categories and products
3. **UI Update**: Categories and products are updated in the UI

## Benefits

1. **Better Performance**: No unnecessary API calls when selecting categories
2. **Reduced Network Traffic**: Fewer requests to the server
3. **Faster UI Response**: Category filtering happens instantly
4. **Better User Experience**: No loading states for category changes
5. **Reduced Server Load**: Less strain on the API server

## Testing

### To Verify the Fixes:

1. **Open Browser Dev Tools**: Go to Network tab
2. **Select a Category**: Choose different categories from the dropdown
3. **Monitor Network**: You should see:
   - No new API calls when selecting categories
   - Only URL changes in the browser
   - Products filtering instantly without loading

### Console Logs to Monitor:

- `"API Request:"` logs will show all API calls being made
- `"CatalogContext: Updating category"` logs will show category changes
- No `"Category change listener: Invalidating queries"` logs (should be removed)

## Notes

- Category changes now only update the URL and filter existing data
- Catalog changes still trigger API calls as they need fresh data
- The axios interceptor loop has been fixed to prevent duplicate requests
- Added debugging to help identify any remaining unnecessary API calls
- The fix maintains all existing functionality while improving performance

