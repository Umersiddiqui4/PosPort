import api from "@/utils/axios";

export const deleteProduct = async (id: string, attachments?: Array<{ id: string }>): Promise<void> => {
  try {
    // First, delete all attachments if they exist
    if (attachments && attachments.length > 0) {
      console.log('Deleting product attachments:', attachments)
      for (const attachment of attachments) {
        try {
          await api.delete(`/attachments/${attachment.id}`);
          console.log('Deleted attachment:', attachment.id)
        } catch (attachmentError: any) {
          console.error('Failed to delete attachment:', attachment.id, attachmentError)
          // Continue with other attachments even if one fails
        }
      }
    }
    
    // Then delete the product
    await api.delete(`/products/${id}`);
    console.log('Product deleted successfully:', id)
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete product");
  }
}; 