import { useUserDataStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import axios from "axios";
import { tokenManager } from "@/lib/auth/tokenManager";

export function useLogout() {
  const logout = useUserDataStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = tokenManager.getAccessToken();
      await axios.post(
        "https://dev-api.posport.io/api/v1/auth/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
    } catch (e) {
      // Optionally handle error
    } finally {
      logout();
      // Clear all tokens and user data securely
      tokenManager.clearTokens();
      router.push("/login");
    }
  };

  return handleLogout;
} 