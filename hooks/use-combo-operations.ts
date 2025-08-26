import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCombo } from '@/lib/Api/deleteCombo'
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

  const handleDeleteCombo = async (comboId: string) => {
    try {
      await deleteComboMutation.mutateAsync(comboId)
    } catch (error) {
      console.error('Failed to delete combo:', error)
    }
  }

  return {
    deleteCombo: handleDeleteCombo,
    isDeleting: deleteComboMutation.isPending,
  }
}
