import { useMutation } from '@tanstack/react-query';
import api from "@/utils/axios";
import { any } from 'zod';

interface UpdateCategoryPayload {
  id: string;
  name?: string;
  description?: string;
  // Add other fields as needed
}

interface Category {
  id: string;
  name: string;
  description?: string;
  // Add other fields as needed
}

async function updateCategory({ id, ...data }: UpdateCategoryPayload): Promise<Category> {
    try {
      const response = await api.put(`/product-categories/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  

export function useUpdateCategory() {
  return useMutation({
    mutationFn: updateCategory,
  });
}
