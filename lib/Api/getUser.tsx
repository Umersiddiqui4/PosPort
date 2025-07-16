"use client";
            
import axios from "axios";

const BASE_URL = "https://dev-api.posport.io/api/v1";

export const getUsers = async (page = 1, take = 10) => {
  const response = await axios.get(`${BASE_URL}/users`, {
    params: { page, take },
    headers: {
      Authorization: `Bearer YOUR_ACCESS_TOKEN_HERE`, // agar required ho
    },
  });
  return response.data;
};
