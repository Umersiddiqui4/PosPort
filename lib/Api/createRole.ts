import axios from "@/utils/axios"

export async function createRole({ name, description }: { name: string; description: string }) {
  const response = await axios.post("/roles", { name, description })
  return response.data
} 