"use client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import { uploadAttachment, type UploadAttachmentRequest } from "@/lib/Api/uploadAttachment"
import { deleteAttachment } from "@/lib/Api/deleteAttachment"

export function useAttachments() {
  // Upload attachment
  const uploadAttachmentMutation = useMutation({
    mutationFn: (attachmentData: UploadAttachmentRequest) => uploadAttachment(attachmentData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "File uploaded successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to upload file",
        variant: "destructive",
      })
    },
  })

  // Delete attachment
  const deleteAttachmentMutation = useMutation({
    mutationFn: (attachmentId: string) => deleteAttachment(attachmentId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "File deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete file",
        variant: "destructive",
      })
    },
  })

  return {
    uploadAttachment: uploadAttachmentMutation,
    deleteAttachment: deleteAttachmentMutation,
  }
}
