/**
 * API Error Handling Utilities
 * Handles common HTTP error scenarios
 */

export interface APIErrorResponse {
  statusCode: number;
  message: string;
  details?: unknown;
}

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Parse error response from API
 */
export function parseAPIError(response: Response): APIErrorResponse {
  const statusCode = response.status;
  
  // Default messages for common status codes
  const defaultMessages: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'You are not authenticated. Please log in.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This request conflicts with existing data.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.',
    503: 'Service temporarily unavailable. Please try again later.',
  };

  return {
    statusCode,
    message: defaultMessages[statusCode] || 'An unexpected error occurred.',
  };
}

/**
 * Handle common API errors
 */
export function handleAPIError(statusCode: number, message?: string): string {
  switch (statusCode) {
    case 400:
      return message || 'Please check your input and try again.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The resource you requested was not found.';
    case 409:
      return 'This action conflicts with existing data. Please refresh and try again.';
    case 429:
      return 'You are making too many requests. Please wait a moment and try again.';
    case 500:
    case 503:
      return 'Server error. Please try again in a few moments.';
    default:
      return message || 'An unexpected error occurred.';
  }
}

/**
 * Check if error is authorization-related (401/403)
 */
export function isAuthError(statusCode: number): boolean {
  return statusCode === 401 || statusCode === 403;
}

/**
 * Check if error is client error (4xx)
 */
export function isClientError(statusCode: number): boolean {
  return statusCode >= 400 && statusCode < 500;
}

/**
 * Check if error is server error (5xx)
 */
export function isServerError(statusCode: number): boolean {
  return statusCode >= 500 && statusCode < 600;
}
