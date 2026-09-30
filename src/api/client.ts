import axios, { type AxiosError } from 'axios';
import { getToken, clearToken } from '@/lib/token';

const BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  'https://mock-mobile-provider.vercel.app';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

// Attach the Bearer token on every request.
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling: a 401 clears the session and redirects to login.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url ?? '';
    // Only clear + redirect on 401 from protected routes. A 401 from /auth/*
    // (e.g. wrong credentials at login) must surface as an inline error.
    if (status === 401 && !url.includes('/auth/')) {
      clearToken();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);