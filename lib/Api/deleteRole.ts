import axios from "@/utils/axios"

export async function deleteRole(id: string) {
  const response = await axios.delete(`/roles/${id}`)
  return response.data
} 