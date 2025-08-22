import api from "@/utils/axios";

export const deleteAttachment = async (attachmentId: string): Promise<void> => {
  try {
    console.log('Deleting attachment with ID:', attachmentId)
    const response = await api.delete(`/attachments/${attachmentId}`);
    console.log('Delete attachment response:', response)
  } catch (error: any) {
    console.error('Delete attachment error:', error?.response?.data || error)
    throw new Error(error?.response?.data?.message || "Failed to delete attachment");
  }
};
