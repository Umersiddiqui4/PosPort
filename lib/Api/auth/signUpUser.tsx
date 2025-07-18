// @/lib/Api/auth/signupUser.ts

import axios from "axios";

const BASE_URL = "https://dev-api.posport.io/api/v1";

export const signupUser = async (data: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}) => {
  console.log("Signup data:", data);

  const response = await axios.post(`${BASE_URL}/auth/email/signup`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
