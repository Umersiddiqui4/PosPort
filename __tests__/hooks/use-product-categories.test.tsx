import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProductCategories, useCreateProductCategory, useUpdateProductCategory, useDeleteProductCategory } from '@/hooks/use-product-categories';
import { getCategories } from '@/lib/Api/getCategories';
import { createCategory } from '@/lib/Api/createCategory';
import { useUpdateCategory } from '@/lib/Api/updateCategory';
import { deleteCategory } from '@/lib/Api/deleteCategory';

// Mock the API functions
jest.mock('@/lib/Api/getCategories');
jest.mock('@/lib/Api/createCategory');
jest.mock('@/lib/Api/updateCategory');
jest.mock('@/lib/Api/deleteCategory');
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

const mockGetCategories = getCategories as jest.MockedFunction<typeof getCategories>;
const mockCreateCategory = createCategory as jest.MockedFunction<typeof createCategory>;
const mockUseUpdateCategory = useUpdateCategory as jest.MockedFunction<typeof useUpdateCategory>;
const mockDeleteCategory = deleteCategory as jest.MockedFunction<typeof deleteCategory>;

// Create a wrapper component for testing
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useProductCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useProductCategories', () => {
    it('should fetch product categories successfully', async () => {
      const mockCategories = {
        items: [
          {
            id: '1',
            categoryName: 'Electronics',
            description: 'Electronic items',
            status: 'active' as const,
            color: '#ff0000',
            icon: 'phone',
            productCount: 5,
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
          },
        ],
        total: 1,
        page: 1,
        take: 10,
      };

      mockGetCategories.mockResolvedValue(mockCategories as any);

      const { result } = renderHook(() => useProductCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual([
        {
          id: '1',
          categoryName: 'Electronics',
          description: 'Electronic items',
          status: 'active',
          color: '#ff0000',
          icon: 'phone',
          parentId: undefined,
          productCount: 5,
          companyId: undefined,
          locationId: undefined,
          menuId: undefined,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
      ]);
    });

    it('should handle error when fetching categories fails', async () => {
      const error = new Error('Failed to fetch categories');
      mockGetCategories.mockRejectedValue(error);

      const { result } = renderHook(() => useProductCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useCreateProductCategory', () => {
    it('should create a product category successfully', async () => {
      const mockResponse = {
        id: '2',
        categoryName: 'New Category',
        description: 'New category description',
        status: 'active' as const,
        color: '#00ff00',
        icon: 'star',
        companyId: 'company1',
        locationId: 'location1',
        menuId: 'menu1',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };

      mockCreateCategory.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateProductCategory(), {
        wrapper: createWrapper(),
      });

      const categoryData = {
        categoryName: 'New Category',
        description: 'New category description',
        status: 'active' as const,
        color: '#00ff00',
        icon: 'star',
        companyId: 'company1',
        locationId: 'location1',
        menuId: 'menu1',
      };

      await result.current.mutateAsync(categoryData);

      expect(mockCreateCategory).toHaveBeenCalledWith(categoryData);
    });

    it('should handle error when creating category fails', async () => {
      const error = new Error('Failed to create category');
      mockCreateCategory.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateProductCategory(), {
        wrapper: createWrapper(),
      });

      const categoryData = {
        categoryName: 'New Category',
        description: 'New category description',
        status: 'active' as const,
        color: '#00ff00',
        icon: 'star',
        companyId: 'company1',
        locationId: 'location1',
        menuId: 'menu1',
      };

      try {
        await result.current.mutateAsync(categoryData);
      } catch (e) {
        expect(e).toBe(error);
      }
    });
  });

  describe('useUpdateProductCategory', () => {
    it('should update a product category successfully', async () => {
      const mockResponse = {
        id: '1',
        categoryName: 'Updated Category',
        description: 'Updated description',
        status: 'active' as const,
        color: '#0000ff',
        icon: 'heart',
        companyId: 'company1',
        locationId: 'location1',
        menuId: 'menu1',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };

      const mockMutation = {
        mutateAsync: jest.fn().mockResolvedValue(mockResponse),
      } as any;

      mockUseUpdateCategory.mockReturnValue(mockMutation);

      const { result } = renderHook(() => useUpdateProductCategory(), {
        wrapper: createWrapper(),
      });

      const updateData = {
        id: '1',
        data: {
          categoryName: 'Updated Category',
          description: 'Updated description',
        },
      };

      await result.current.mutateAsync(updateData);

      expect(mockMutation.mutateAsync).toHaveBeenCalledWith({
        id: '1',
        categoryName: 'Updated Category',
        description: 'Updated description',
      });
    });

    it('should handle error when updating category fails', async () => {
      const error = new Error('Failed to update category');
      const mockMutation = {
        mutateAsync: jest.fn().mockRejectedValue(error),
      } as any;

      mockUseUpdateCategory.mockReturnValue(mockMutation);

      const { result } = renderHook(() => useUpdateProductCategory(), {
        wrapper: createWrapper(),
      });

      const updateData = {
        id: '1',
        data: {
          categoryName: 'Updated Category',
        },
      };

      try {
        await result.current.mutateAsync(updateData);
      } catch (e) {
        expect(e).toBe(error);
      }
    });
  });

  describe('useDeleteProductCategory', () => {
    it('should delete a product category successfully', async () => {
      mockDeleteCategory.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteProductCategory(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync('1');

      expect(mockDeleteCategory).toHaveBeenCalledWith('1');
    });

    it('should handle error when deleting category fails', async () => {
      const error = new Error('Failed to delete category');
      mockDeleteCategory.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteProductCategory(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync('1');
      } catch (e) {
        expect(e).toBe(error);
      }
    });
  });
});
