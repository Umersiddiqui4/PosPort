import axios from "@/utils/axios"

export async function editRole({ id, name, description }: { id: string; name: string; description: string }) {
  const response = await axios.put(`/roles/${id}`, { name, description })
  return response.data
} 