import axios from 'axios';

export interface ApiError {
  status?: number;
  message: string;
}

// Normalize any thrown value into a user-friendly error. Never surfaces raw
// backend stack traces.
export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as Record<string, unknown> | undefined;
    const serverMsg =
      (typeof data?.message === 'string' && data.message) ||
      (typeof data?.error === 'string' && data.error) ||
      (typeof data?.detail === 'string' && data.detail) ||
      undefined;

    if (!error.response) {
      return { status, message: 'Unable to connect to the wallet service' };
    }

    switch (status) {
      case 400:
        return { status, message: serverMsg || 'Invalid request' };
      case 401:
        return { status, message: 'Session expired. Please log in again.' };
      case 403:
        return { status, message: 'Your account is blocked' };
      case 404:
        return { status, message: 'Resource not found' };
      case 422:
        return { status, message: serverMsg || 'Maximum balance exceeded' };
      case 500:
        return { status, message: 'Something went wrong' };
      case 503:
        return { status, message: 'Unable to connect to the wallet service' };
      default:
        return { status, message: serverMsg || 'Something went wrong' };
    }
  }

  return { message: 'Something went wrong' };
}