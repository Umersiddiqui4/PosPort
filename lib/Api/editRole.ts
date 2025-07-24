import axios from "@/utils/axios"

export async function editRole({
  id,
  name,
  description,
  companyId,
}: {
  id: string;
  name: string;
  description: string;
  companyId: string;
}) {
  const response = await axios.put(`/roles/${id}`, { name, description, companyId });
  return response.data;
}