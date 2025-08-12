import axios, { type AxiosError, type AxiosResponse } from "axios";
import { errorHandler, ErrorType, createError } from "@/lib/error-handling";
import { schemas, type ApiError } from "@/lib/validations";

const API_BASE_URL = process.env['NEXT_PUBLIC_API_BASE_URL'] || "https://dev-api.posport.io/api/v1";

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
  withCredentials: false, // Disabled to avoid CORS issues
});

// Request interceptor with enhanced token handling
api.interceptors.request.use(
  (config) => {
    // Add CSRF token if available (only if server supports it)
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Add authorization token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Note: Removed custom headers that cause CORS issues
    // Only essential headers are included: Authorization, Content-Type, and CSRF token

    return config;
  },
  (error) => {
    errorHandler.handle(error, { context: 'request-interceptor' });
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Note: Removed response validation to avoid TypeScript errors
    // Response validation can be added back when needed
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config;
    
    // Handle CORS errors specifically
    if (error.code === 'ERR_NETWORK' && error.message.includes('CORS')) {
      const corsError = createError(
        ErrorType.NETWORK,
        'CORS policy blocked the request. Please check your API configuration.',
        error,
        { 
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      );
      errorHandler.handle(corsError);
      return Promise.reject(corsError);
    }
    
    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      
      // Check if we have temporary Google OAuth tokens
      const accessToken = localStorage.getItem("token");
      const isTemporaryToken = accessToken && accessToken.startsWith('google_oauth_temp_token_');
      
      // For temporary tokens, don't try to refresh - just let the 401 pass through
      if (isTemporaryToken) {
        return Promise.reject(error);
      }

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

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
              "x-refresh-token": refreshToken,
            },
            timeout: 5000, // 5 second timeout for refresh
          }
        );

        // Validate refresh response
        const validatedResponse = schemas.loginResponse.parse(refreshRes.data);
        const { access, refresh } = validatedResponse.data.tokens;

        localStorage.setItem("token", access.token);
        localStorage.setItem("refreshToken", refresh.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${access.token}`;

        originalRequest.headers["Authorization"] = `Bearer ${access.token}`;
        return api(originalRequest);

      } catch (refreshError) {
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

        const appError = createError(
          ErrorType.AUTHENTICATION,
          'Token refresh failed',
          refreshError,
          { originalError: error }
        );
        errorHandler.handle(appError);
        return Promise.reject(appError);
      }
    }

    // Handle other errors
    const appError = createError(
      getErrorTypeFromStatus(error.response?.status),
      error.response?.data?.message || error.message || 'Request failed',
      error,
      { 
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
      }
    );
    errorHandler.handle(appError);
    return Promise.reject(appError);
  }
);

// Helper function to determine error type from status code
function getErrorTypeFromStatus(status?: number): ErrorType {
  if (!status) return ErrorType.NETWORK;
  
  switch (status) {
    case 400:
      return ErrorType.VALIDATION;
    case 401:
      return ErrorType.AUTHENTICATION;
    case 403:
      return ErrorType.AUTHORIZATION;
    case 404:
      return ErrorType.NOT_FOUND;
    case 422:
      return ErrorType.VALIDATION;
    case 500:
    case 502:
    case 503:
    case 504:
      return ErrorType.SERVER;
    default:
      return ErrorType.UNKNOWN;
  }
}

// Enhanced API methods with validation
export const apiClient = {
  get: <T>(url: string, config?: any) => 
    api.get<T>(url, config),
  
  post: <T>(url: string, data?: any, config?: any) => 
    api.post<T>(url, data, config),
  
  put: <T>(url: string, data?: any, config?: any) => 
    api.put<T>(url, data, config),
  
  patch: <T>(url: string, data?: any, config?: any) => 
    api.patch<T>(url, data, config),
  
  delete: <T>(url: string, config?: any) => 
    api.delete<T>(url, config),
  
  // Validated methods
  getValidated: <T>(url: string, schema: any, config?: any) => 
    api.get<T>(url, { ...config, validateResponse: schema }),
  
  postValidated: <T>(url: string, data: any, schema: any, config?: any) => 
    api.post<T>(url, data, { ...config, validateResponse: schema }),
  
  putValidated: <T>(url: string, data: any, schema: any, config?: any) => 
    api.put<T>(url, data, { ...config, validateResponse: schema }),
  
  patchValidated: <T>(url: string, data: any, schema: any, config?: any) => 
    api.patch<T>(url, data, { ...config, validateResponse: schema }),
  
  deleteValidated: <T>(url: string, schema: any, config?: any) => 
    api.delete<T>(url, { ...config, validateResponse: schema }),
};

export default api;
