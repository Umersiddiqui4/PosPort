"use client";

import { useUserDataStore } from "@/lib/store";
import { useEffect } from "react";

export const useCurrentUser = () => {
  const user = useUserDataStore((state) => state.user);
  const isLoggedIn = useUserDataStore((state) => state.isLoggedIn);

  return {
    user,
    isLoggedIn,
  };
}; 