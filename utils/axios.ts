// utils/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://your-api-url.com/api",
  withCredentials: true, // if you're using HttpOnly cookies
});

// flag to avoid infinite loops
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await axios.post("https://your-api-url.com/api/auth/refresh-token", {
            refreshToken: localStorage.getItem("refreshToken"),
          });
 console.log("Token refreshed:", response.data);
 
          const newAccessToken = response.data.accessToken;
          localStorage.setItem("token", newAccessToken);

          api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          onTokenRefreshed(newAccessToken);
        } catch (e) {
          // Refresh token expired
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login"; // redirect to login
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((token: string) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(err);
  }
);

export default api;
