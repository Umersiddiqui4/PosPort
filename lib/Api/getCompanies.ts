export const getCompanies = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch("https://dev-api.posport.io/api/v1/companies?page=1&take=10&user=false", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }

  const data = await response.json();
  return data.data;
};
