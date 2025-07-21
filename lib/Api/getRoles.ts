import api from "@/utils/axios";

export const getRoles = async () => {
  const token = localStorage.getItem("token");
  
  try {
  const response = await api.get("https://dev-api.posport.io/api/v1/roles?page=1&take=10", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.data;
  return data.data; // Adjust if API response format is different

  } catch (error) {

    throw new Error("Failed to fetch roles");
  }
};
