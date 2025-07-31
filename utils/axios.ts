import axios from "axios";

const API_BASE_URL = "https://dev-api.posport.io/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor — add token in all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response Interceptor — handle 401 and retry
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const orig = err.config;

    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      
      // Check if we have temporary Google OAuth tokens
      const accessToken = localStorage.getItem("token");
      const isTemporaryToken = accessToken && accessToken.startsWith('google_oauth_temp_token_');
      
      // For temporary tokens, don't try to refresh - just let the 401 pass through
      if (isTemporaryToken) {
        return Promise.reject(err);
      }

        try {
          const refreshToken = localStorage.getItem("refreshToken");
        
        const body = {
          deviceToken: "myDeviceToken",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          body,
          
          {
            headers: {
              "Content-Type": "application/json",
              "x-refresh-token": refreshToken || "",
            },
          }
        );

        const { access, refresh } = refreshRes.data.data.tokens;

        localStorage.setItem("token", access.token);
        localStorage.setItem("refreshToken", refresh.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${access.token}`;

        orig.headers["Authorization"] = `Bearer ${access.token}`;
        return api(orig);

      } catch (e) {
        // Check if we have temporary Google OAuth tokens
        const token = localStorage.getItem("token");
        const isTemporaryToken = token && token.startsWith('google_oauth_temp_token_');
        
        // Only clear tokens if they're not temporary Google OAuth tokens
        if (!isTemporaryToken) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
        
        // Only redirect to login if we're not already on a public page
        const currentPath = window.location.pathname;
        const publicPaths = ["/helloScreen", "/login", "/signup", "/google-callback", "/companies-page", "/companies"];
        
        // Don't redirect if we're on companies page (might be during OAuth flow)
        if (!publicPaths.includes(currentPath)) {
          window.location.href = "/login";
        }
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);


export default api;
