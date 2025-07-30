import api from "@/utils/axios"

export interface AssignedUser {
  id: string
  assignedAt: string
  assignedById: string
  unassignedAt: string | null
  unassignedById: string | null
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    companyId: string
    createdAt: string
    updatedAt: string
  }
  location: {
    id: string
    locationName: string
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    phone: string
    email: string
    qrCode: string
    companyId: string
    createdAt: string
    updatedAt: string
  }
}

export interface GetAssignedUsersResponse {
  data: AssignedUser[]
  meta: {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: boolean
    hasNextPage: boolean
  }
}

export const getAssignedUsers = async (page = 1, take = 10): Promise<GetAssignedUsersResponse> => {
  const response = await api.get("/location-users", {
    params: { page, take },
  })
  return response.data
} 