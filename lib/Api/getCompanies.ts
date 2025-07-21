import api from "@/utils/axios";

export const getCompanies = async () => {
  const token = localStorage.getItem("token");
  try {

  const response = await api.get("https://dev-api.posport.io/api/v1/companies?page=1&take=10&user=false", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.data;
  return data.data;

  } catch (error) {

    throw new Error("Failed to fetch roles");
  }

};
