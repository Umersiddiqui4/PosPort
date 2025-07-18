export const getRoles = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch("https://dev-api.posport.io/api/v1/roles?page=1&take=10", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch roles");
  }

  const data = await response.json();
  return data.data; // Adjust if API response format is different
};
