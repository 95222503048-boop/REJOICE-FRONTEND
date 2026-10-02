/**
 * Centralized API client for backend communication
 *
 * - Base URL from environment configuration
 * - Credentials included for authenticated requests (HttpOnly cookies)
 * - CSRF token support (fetched on demand, cached)
 * - Consistent error handling
 * - No hardcoded secrets
 */

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api';

interface APIError {
  statusCode: number;
  message: string;
  details?: unknown;
}

class APIClient {
  private baseUrl: string;
  private csrfToken: string | null = null;
  private csrfTokenPromise: Promise<string> | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch CSRF token from backend (cached in memory)
   */
  private async getCsrfToken(): Promise<string> {
    // Return cached token if available
    if (this.csrfToken) {
      return this.csrfToken;
    }

    // Prevent race conditions by caching the fetch promise
    if (this.csrfTokenPromise) {
      return this.csrfTokenPromise;
    }

    this.csrfTokenPromise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}/csrf-token`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch CSRF token');
        }
        const data = (await response.json()) as { token: string };
        this.csrfToken = data.token;
        this.csrfTokenPromise = null;
        return this.csrfToken;
      } catch (error) {
        this.csrfTokenPromise = null;
        throw error;
      }
    })();

    return this.csrfTokenPromise;
  }

  /**
   * Parse error response from backend
   */
  private async parseError(response: Response): Promise<APIError> {
    let message = response.statusText;
    let details: unknown;

    try {
      const data = await response.json();
      message = data.message || message;
      details = data.details;
    } catch {
      // Response was not JSON
    }

    return {
      statusCode: response.status,
      message,
      details,
    };
  }

  /**
   * Make an API request with credentials and CSRF protection
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Only set Content-Type to JSON if body is not FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const method = options.method || 'GET';

    // Add CSRF token for state-changing requests (POST, PATCH, PUT, DELETE)
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      try {
        const csrfToken = await this.getCsrfToken();
        headers['X-CSRF-Token'] = csrfToken;
      } catch (error) {
        console.error('Failed to get CSRF token:', error);
        throw new Error('CSRF token unavailable');
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Include HttpOnly cookies
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await this.parseError(response);
      throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    try {
      return (await response.json()) as T;
    } catch {
      // Response was not JSON (but was 2xx)
      return {} as T;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   * Supports both JSON objects and FormData
   */
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    let requestBody: BodyInit | undefined;
    
    if (body instanceof FormData) {
      requestBody = body;
    } else if (body !== undefined) {
      requestBody = JSON.stringify(body);
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: requestBody,
    });
  }

  /**
   * PUT request
   * Supports both JSON objects and FormData
   */
  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    let requestBody: BodyInit | undefined;
    
    if (body instanceof FormData) {
      requestBody = body;
    } else if (body !== undefined) {
      requestBody = JSON.stringify(body);
    }

    return this.request<T>(endpoint, {
      method: 'PUT',
      body: requestBody,
    });
  }

  /**
   * PATCH request
   * Supports both JSON objects and FormData
   */
  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    let requestBody: BodyInit | undefined;
    
    if (body instanceof FormData) {
      requestBody = body;
    } else if (body !== undefined) {
      requestBody = JSON.stringify(body);
    }

    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: requestBody,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new APIClient();
export type { APIError };
