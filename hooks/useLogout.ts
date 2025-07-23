import { useUserDataStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import axios from "axios";

export function useLogout() {
  const logout = useUserDataStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
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
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      router.push("/login");
    }
  };

  return handleLogout;
} 