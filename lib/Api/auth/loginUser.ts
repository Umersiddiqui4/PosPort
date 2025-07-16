"use client";

import axios from "axios";

const BASE_URL = "https://dev-api.posport.io/api/v1";

export const loginUser = async (data: { email: string; password: string }) => {
    console.log("Login data:", data); // Debugging line to check the data being sent
    
  const response = await axios.post(`${BASE_URL}/auth/email/login`, JSON.stringify(data), {
  headers: {
    "Content-Type": "application/json",
  },
});
  return response.data;
};
