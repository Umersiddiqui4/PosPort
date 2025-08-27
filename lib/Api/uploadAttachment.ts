import api from "@/utils/axios";

// Type-safe mapping of entity types to their valid categories
type EntityCategoryMapping = {
  catalog: "catalog_banner";
  product: "product_image";
  product_category: "category_image";
  user: "user_profile";
  company: "company_logo";
}

export interface UploadAttachmentRequest {
  tenantId: string; // companyId
  entityId: string; // product, catalog, or user id
  entityType: keyof EntityCategoryMapping;
  category: EntityCategoryMapping[keyof EntityCategoryMapping];
  file: File;
}

// Helper function to get valid category for entity type
export function getValidCategory(entityType: keyof EntityCategoryMapping): EntityCategoryMapping[typeof entityType] {
  const mapping: EntityCategoryMapping = {
    catalog: "catalog_banner",
    product: "product_image",
    product_category: "category_image",
    user: "user_profile",
    company: "company_logo"
  };
  return mapping[entityType];
}

export interface UploadAttachmentResponse {
  data: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    entityId: string;
    entityType: string;
    category: string;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}

export const uploadAttachment = async (attachmentData: UploadAttachmentRequest): Promise<UploadAttachmentResponse> => {
  try {
    // Validate category matches entity type
    const expectedCategory = getValidCategory(attachmentData.entityType);
    if (attachmentData.category !== expectedCategory) {
      console.warn(`Category mismatch: expected ${expectedCategory} for ${attachmentData.entityType}, got ${attachmentData.category}`);
    }

    // Debug logging
    console.log('Upload Attachment Data:', {
      tenantId: attachmentData.tenantId,
      entityId: attachmentData.entityId,
      entityType: attachmentData.entityType,
      category: attachmentData.category,
      expectedCategory,
      fileName: attachmentData.file.name,
      fileType: attachmentData.file.type
    });

    // Add metadata to FormData
    const formData = new FormData();
    formData.append('file', attachmentData.file);
    formData.append('tenantId', attachmentData.tenantId);
    formData.append('entityId', attachmentData.entityId);
    formData.append('entityType', attachmentData.entityType);
    formData.append('category', attachmentData.category);

    // Debug FormData contents
    console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await api.post<UploadAttachmentResponse>("/attachments/upload/image", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Upload attachment error:', error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Failed to upload attachment");
  }
};
