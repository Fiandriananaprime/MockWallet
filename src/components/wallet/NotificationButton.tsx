import { Bell, Check, Copy, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNotifications } from '@/hook/useNotifications';

const READ_NOTIFICATIONS_KEY = 'novamarket.read-phone-notifications';

function readNotificationIds(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(READ_NOTIFICATIONS_KEY) ?? '[]');
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function NotificationButton() {
  const [open, setOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ top: 16, left: 16 });
  const [readIds, setReadIds] = useState<string[]>(readNotificationIds);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { data = [], isLoading, isError } = useNotifications();
  const unreadCount = data.filter((notification) => !readIds.includes(notification.id)).length;

  const updatePanelPosition = () => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const width = Math.min(352, window.innerWidth - 32);
    const height = Math.min(480, window.innerHeight - 32);
    const left = Math.min(
      Math.max(16, rect.right - width),
      window.innerWidth - width - 16,
    );
    const below = rect.bottom + 8;
    const top = below + height <= window.innerHeight - 16
      ? below
      : Math.max(16, rect.top - height - 8);
    setPanelPosition({ top, left });
  };

  const markAsRead = () => {
    const ids = [...new Set([...readIds, ...data.map((notification) => notification.id)])];
    setReadIds(ids);
    localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(ids));
  };

  useEffect(() => {
    if (!open) return undefined;
    updatePanelPosition();
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!buttonRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Open notifications"
        aria-expanded={open}
        onClick={() => {
          if (!open) updatePanelPosition();
          setOpen((value) => !value);
        }}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-destructive px-1 text-center text-[10px] font-semibold leading-4 text-destructive-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={panelRef}
          style={{ top: panelPosition.top, left: panelPosition.left }}
          className="fixed z-[100] w-[min(22rem,calc(100vw-2rem))] rounded-xl border bg-background p-3 shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Notifications</h2>
              <p className="text-xs text-muted-foreground">SMS de vérification reçus</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={markAsRead} className="text-xs text-muted-foreground hover:text-foreground">
                <Check className="mr-1 inline h-3.5 w-3.5" /> Lu
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fermer les notifications" className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          {isLoading && <p className="py-6 text-center text-sm text-muted-foreground">Chargement…</p>}
          {isError && <p className="py-6 text-center text-sm text-destructive">Notifications indisponibles.</p>}
          {!isLoading && !isError && data.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">Aucune notification.</p>
          )}
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {data.map((notification) => (
              <article key={notification.id} className="rounded-lg border bg-muted/20 p-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-medium">{notification.type}</span>
                  <time className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</time>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{notification.phoneNumber}</p>
                <p className="mt-2">{notification.message}</p>
                <div className="mt-2 flex items-center justify-between rounded-md bg-background px-2 py-1.5">
                  <span className="font-mono font-semibold tracking-widest">{notification.otp}</span>
                  <button
                    type="button"
                    aria-label="Copy OTP"
                    onClick={() => void navigator.clipboard?.writeText(notification.otp)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
