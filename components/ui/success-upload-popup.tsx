"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/ui/file-upload"
import { CheckCircle, Upload } from "lucide-react"
import { useAttachments } from "@/hooks/use-attachments"
import { useUserDataStore } from "@/lib/store"
import { getValidCategory } from "@/lib/Api/uploadAttachment"

interface SuccessUploadPopupProps {
  isOpen: boolean
  onClose: () => void
  entityId: string
  entityType: "catalog" | "product" | "product_category" | "user" | "company"
  itemName: string
  onUploadSuccess?: (fileUrl: string) => void
}

export function SuccessUploadPopup({
  isOpen,
  onClose,
  entityId,
  entityType,
  itemName,
  onUploadSuccess
}: SuccessUploadPopupProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { uploadAttachment } = useAttachments()
  const user = useUserDataStore((state) => state.user)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
  }

  const handleUpload = async () => {
    if (!selectedFile || !user?.companyId) {
      return
    }

    setIsUploading(true)
    try {
      // Get the correct category for the entity type
      const category = getValidCategory(entityType);
      
      const response = await uploadAttachment.mutateAsync({
        tenantId: user.companyId,
        entityId,
        entityType,
        category,
        file: selectedFile,
      })

      onUploadSuccess?.(response.data.fileUrl)
      onClose()
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <DialogTitle className="text-lg font-semibold">
              {itemName} created successfully!
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Do you want to upload a photo for this {entityType}?
            </p>
          </div>

          <FileUpload
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            selectedFile={selectedFile}
            maxSize={5}
          />

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={isUploading}
            >
              Skip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
