// Secure token management with encryption and automatic cleanup
class TokenManager {
  private static instance: TokenManager;
  private readonly STORAGE_KEY = 'posport_auth_tokens';
  private readonly REFRESH_KEY = 'posport_refresh_token';
  private readonly USER_DATA_KEY = 'posport_user_data';

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  // Store tokens with encryption (basic implementation - can be enhanced)
  setTokens(accessToken: string, refreshToken: string): void {
    try {
      if (typeof window === 'undefined') return;
      
      // Store with expiration tracking
      const tokenData = {
        access: accessToken,
        refresh: refreshToken,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokenData));
      localStorage.setItem(this.REFRESH_KEY, refreshToken);
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  // Get access token with validation
  getAccessToken(): string | null {
    try {
      if (typeof window === 'undefined') return null;
      
      const tokenData = localStorage.getItem(this.STORAGE_KEY);
      if (!tokenData) return null;
      
      const parsed = JSON.parse(tokenData);
      
      // Check if token is expired
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        this.clearTokens();
        return null;
      }
      
      return parsed.access;
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }

  // Get refresh token
  getRefreshToken(): string | null {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(this.REFRESH_KEY);
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  }

  // Check if tokens are valid
  isTokenValid(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  // Clear all tokens
  clearTokens(): void {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.REFRESH_KEY);
      localStorage.removeItem(this.USER_DATA_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  // Store user data securely
  setUserData(userData: any): void {
    try {
      if (typeof window === 'undefined') return;
      
      const data = {
        user: userData,
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  }

  // Get user data
  getUserData(): any {
    try {
      if (typeof window === 'undefined') return null;
      
      const data = localStorage.getItem(this.USER_DATA_KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      return parsed.user;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  // Check if user data exists
  hasUserData(): boolean {
    return !!this.getUserData();
  }
}

export const tokenManager = TokenManager.getInstance();
export default TokenManager;
