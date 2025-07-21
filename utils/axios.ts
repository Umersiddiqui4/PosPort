import axios from "axios";

const api = axios.create({
  baseURL: "https://dev-api.posport.io/api/v1",
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

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const body = {
          deviceToken: "myDeviceToken",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

        const refreshRes = await axios.post(
          "https://dev-api.posport.io/api/v1/auth/refresh",
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
                 localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);


export default api;
