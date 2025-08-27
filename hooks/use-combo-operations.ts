import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCombo } from '@/lib/Api/deleteCombo'
import { createCombo, CreateComboRequest } from '@/lib/Api/createCombo'
import { updateCombo, UpdateComboRequest } from '@/lib/Api/updateCombo'
import { updateComboBasic, UpdateComboBasicRequest } from '@/lib/Api/updateComboBasic'
import { addComboItem, AddComboItemRequest } from '@/lib/Api/addComboItem'
import { updateComboItem, UpdateComboItemRequest } from '@/lib/Api/updateComboItem'
import { deleteComboItem } from '@/lib/Api/deleteComboItem'
import { useToast } from '@/hooks/use-toast'

export const useComboOperations = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const deleteComboMutation = useMutation({
    mutationFn: deleteCombo,
    onSuccess: () => {
      // Invalidate and refetch combos
      queryClient.invalidateQueries({ queryKey: ['combos'] })
      queryClient.refetchQueries({ queryKey: ['combos'] })
      toast({
        title: "Combo deleted",
        description: "Combo has been deleted successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete combo.",
        variant: "destructive",
      })
    },
  })

  const createComboMutation = useMutation({
    mutationFn: createCombo,
    onSuccess: () => {
      // Invalidate and refetch combos
      queryClient.invalidateQueries({ queryKey: ['combos'] })
      queryClient.refetchQueries({ queryKey: ['combos'] })
      toast({
        title: "Combo created",
        description: "Combo has been created successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create combo.",
        variant: "destructive",
      })
    },
  })

  const updateComboMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateComboRequest }) => updateCombo(id, data),
    onSuccess: () => {
      // Invalidate and refetch combos
      queryClient.invalidateQueries({ queryKey: ['combos'] })
      queryClient.refetchQueries({ queryKey: ['combos'] })
      toast({
        title: "Combo updated",
        description: "Combo has been updated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update combo.",
        variant: "destructive",
      })
    },
  })

  const updateComboBasicMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateComboBasicRequest }) => updateComboBasic(id, data),
    onSuccess: () => {
      // Invalidate and refetch combos
      queryClient.invalidateQueries({ queryKey: ['combos'] })
      queryClient.refetchQueries({ queryKey: ['combos'] })
      toast({
        title: "Combo updated",
        description: "Combo basic info has been updated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update combo basic info.",
        variant: "destructive",
      })
    },
  })

  const addComboItemMutation = useMutation({
    mutationFn: ({ comboId, data }: { comboId: string; data: AddComboItemRequest }) => addComboItem(comboId, data),
    onSuccess: () => {
      // Invalidate and refetch combos
      queryClient.invalidateQueries({ queryKey: ['combos'] })
      queryClient.refetchQueries({ queryKey: ['combos'] })
      toast({
        title: "Product added",
        description: "Product has been added to combo successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add product to combo.",
        variant: "destructive",
      })
    },
  })

  const updateComboItemMutation = useMutation({
    mutationFn: ({ comboId, itemId, data }: { comboId: string; itemId: string; data: UpdateComboItemRequest }) => 
      updateComboItem(comboId, itemId, data),
    onSuccess: () => {
      // Invalidate and refetch combos
      queryClient.invalidateQueries({ queryKey: ['combos'] })
      queryClient.refetchQueries({ queryKey: ['combos'] })
      toast({
        title: "Quantity updated",
        description: "Product quantity has been updated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product quantity.",
        variant: "destructive",
      })
    },
  })

  const deleteComboItemMutation = useMutation({
    mutationFn: ({ comboId, itemId }: { comboId: string; itemId: string }) => deleteComboItem(comboId, itemId),
    onSuccess: () => {
      // Invalidate and refetch combos
      queryClient.invalidateQueries({ queryKey: ['combos'] })
      queryClient.refetchQueries({ queryKey: ['combos'] })
      toast({
        title: "Product removed",
        description: "Product has been removed from combo successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove product from combo.",
        variant: "destructive",
      })
    },
  })

  const handleDeleteCombo = async (comboId: string) => {
    try {
      await deleteComboMutation.mutateAsync(comboId)
    } catch (error) {
      console.error('Failed to delete combo:', error)
    }
  }

  const handleCreateCombo = async (data: CreateComboRequest) => {
    try {
      await createComboMutation.mutateAsync(data)
    } catch (error) {
      console.error('Failed to create combo:', error)
      throw error
    }
  }

  const handleUpdateCombo = async (id: string, data: UpdateComboRequest) => {
    try {
      await updateComboMutation.mutateAsync({ id, data })
    } catch (error) {
      console.error('Failed to update combo:', error)
      throw error
    }
  }

  const handleUpdateComboBasic = async (id: string, data: UpdateComboBasicRequest) => {
    try {
      await updateComboBasicMutation.mutateAsync({ id, data })
    } catch (error) {
      console.error('Failed to update combo basic info:', error)
      throw error
    }
  }

  const handleAddComboItem = async (comboId: string, data: AddComboItemRequest) => {
    try {
      await addComboItemMutation.mutateAsync({ comboId, data })
    } catch (error) {
      console.error('Failed to add combo item:', error)
      throw error
    }
  }

  const handleUpdateComboItem = async (comboId: string, itemId: string, data: UpdateComboItemRequest) => {
    try {
      await updateComboItemMutation.mutateAsync({ comboId, itemId, data })
    } catch (error) {
      console.error('Failed to update combo item:', error)
      throw error
    }
  }

  const handleDeleteComboItem = async (comboId: string, itemId: string) => {
    try {
      await deleteComboItemMutation.mutateAsync({ comboId, itemId })
    } catch (error) {
      console.error('Failed to delete combo item:', error)
      throw error
    }
  }

  return {
    deleteCombo: handleDeleteCombo,
    createCombo: handleCreateCombo,
    updateCombo: handleUpdateCombo,
    updateComboBasic: handleUpdateComboBasic,
    addComboItem: handleAddComboItem,
    updateComboItem: handleUpdateComboItem,
    deleteComboItem: handleDeleteComboItem,
    isDeleting: deleteComboMutation.isPending,
    isCreating: createComboMutation.isPending,
    isUpdating: updateComboMutation.isPending,
    isUpdatingBasic: updateComboBasicMutation.isPending,
    isAddingItem: addComboItemMutation.isPending,
    isUpdatingItem: updateComboItemMutation.isPending,
    isDeletingItem: deleteComboItemMutation.isPending,
  }
}
