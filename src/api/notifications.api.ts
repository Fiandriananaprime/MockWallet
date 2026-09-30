import { apiClient } from './client';
import type { PhoneVerificationNotification } from '@/types';

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  'https://mock-mobile-provider.vercel.app';

export function toInternationalPhone(msisdn: string): string {
  const digits = msisdn.replace(/\s+/g, '');
  return digits.startsWith('+') ? digits : `+261${digits.replace(/^0/, '')}`;
}

export async function getPhoneNotifications(phoneNumber: string): Promise<PhoneVerificationNotification[]> {
  const { data } = await apiClient.get<{ notifications: PhoneVerificationNotification[] }>(
    '/__mock/verification/notifications',
    { params: { phoneNumber } },
  );
  return data.notifications ?? [];
}

export function getNotificationWebSocketUrl(phoneNumber: string): string {
  const apiUrl = new URL(API_BASE_URL);
  apiUrl.protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  apiUrl.pathname = '/__mock/verification/ws';
  apiUrl.search = new URLSearchParams({ phoneNumber }).toString();
  return apiUrl.toString();
}
