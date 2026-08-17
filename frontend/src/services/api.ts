import {
  CustomerFormData,
  CustomerSubmissionResponse,
  CustomerRecord,
  AdminAnalyticsData,
} from '../types/customer';
import { LoginCredentials, LoginResponse, AuthUser } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const AUTH_TOKEN_KEY = 'iris_auth_token';

export class ApiService {
  /**
   * Helper to get stored auth token.
   */
  private static getStoredToken(): string | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Helper to build request headers with Authorization if token is available.
   */
  private static getAuthHeaders(token?: string): Record<string, string> {
    const activeToken = token || this.getStoredToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`;
    }
    return headers;
  }

  /**
   * Authenticates admin user.
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/auth/login` : '/api/auth/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Authentication failed.');
    }

    return result;
  }

  /**
   * Verifies existing session token.
   */
  static async verifySession(token?: string): Promise<AuthUser | null> {
    const activeToken = token || this.getStoredToken();
    if (!activeToken) return null;

    try {
      const url = API_BASE_URL ? `${API_BASE_URL}/api/auth/me` : '/api/auth/me';
      const response = await fetch(url, {
        headers: this.getAuthHeaders(activeToken),
      });

      if (!response.ok) return null;

      const result = await response.json();
      return result.user || null;
    } catch {
      return null;
    }
  }

  /**
   * Registers a customer via public lead capture endpoint.
   */
  static async registerCustomer(data: CustomerFormData): Promise<CustomerSubmissionResponse> {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/customers` : '/api/customers';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Request failed with status ${response.status}`);
    }

    return result;
  }

  /**
   * Retrieves all registered customers from PostgreSQL (Protected with JWT).
   */
  static async getCustomers(token?: string): Promise<CustomerRecord[]> {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/customers` : '/api/customers';
    const response = await fetch(url, {
      headers: this.getAuthHeaders(token),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch customer records.');
    }

    return result.data || [];
  }

  /**
   * Retrieves aggregated analytics and rainbow color distributions (Protected with JWT).
   */
  static async getAdminAnalytics(token?: string): Promise<AdminAnalyticsData> {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/admin/analytics` : '/api/admin/analytics';
    const response = await fetch(url, {
      headers: this.getAuthHeaders(token),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch analytics.');
    }

    return result.data;
  }

  /**
   * Fetches the dynamic list of rainbow colors supported by the backend (Public).
   */
  static async getRainbowColors(): Promise<string[]> {
    try {
      const url = API_BASE_URL ? `${API_BASE_URL}/api/colors` : '/api/colors';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch colors');
      const data = await response.json();
      return data.colors || [];
    } catch {
      // Fallback colors if backend is initially offline
      return ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'];
    }
  }

  /**
   * Fetches a new dynamic Math CAPTCHA puzzle and HMAC token (Public).
   */
  static async getCaptcha(): Promise<import('../types/customer').CaptchaChallenge> {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/captcha` : '/api/captcha';
    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to load CAPTCHA puzzle.');
    }

    return {
      equation: result.equation,
      svg: result.svg,
      captchaToken: result.captchaToken,
    };
  }

  /**
   * Pings the backend healthcheck endpoint.
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const url = API_BASE_URL ? `${API_BASE_URL}/health` : '/health';
      const response = await fetch(url);
      return response.ok;
    } catch {
      return false;
    }
  }
}
