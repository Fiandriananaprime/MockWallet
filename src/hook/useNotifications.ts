import { useEffect, useState } from 'react';
import {
  getNotificationWebSocketUrl,
  getPhoneNotifications,
  toInternationalPhone,
} from '@/api/notifications.api';
import { useAccount } from '@/hook/useAccount';
import type { PhoneVerificationNotification } from '@/types';

export function useNotifications() {
  const { data: account } = useAccount();
  const phoneNumber = account?.msisdn ? toInternationalPhone(account.msisdn) : undefined;
  const [data, setData] = useState<PhoneVerificationNotification[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(phoneNumber));
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!phoneNumber) {
      setData([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    let socket: WebSocket | undefined;
    let reconnectTimer: number | undefined;

    const loadExistingNotifications = async () => {
      try {
        const notifications = await getPhoneNotifications(phoneNumber);
        if (!cancelled) setData(notifications);
      } catch {
        if (!cancelled) setIsError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    const connect = () => {
      if (cancelled) return;
      socket = new WebSocket(getNotificationWebSocketUrl(phoneNumber));
      socket.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data) as PhoneVerificationNotification;
          setData((current) => current.some((item) => item.id === notification.id)
            ? current
            : [notification, ...current]);
        } catch {
          setIsError(true);
        }
      };
      socket.onerror = () => setIsError(true);
      socket.onclose = () => {
        if (!cancelled) reconnectTimer = window.setTimeout(connect, 3000);
      };
    };

    void loadExistingNotifications();
    connect();
    return () => {
      cancelled = true;
      if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [phoneNumber]);

  return { data, isLoading, isError };
}
