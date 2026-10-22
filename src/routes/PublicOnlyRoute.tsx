import { Navigate, useLocation } from 'react-router-dom';
import { useWalletAuth } from '@/lib/WalletAuth';
import type { ReactNode } from 'react';

// Redirect authenticated users away from public-only pages (login/register).
export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useWalletAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)
    ?.from;
  if (isAuthenticated) {
    const destination = from?.pathname
      ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
      : '/account';
    return <Navigate to={destination} replace />;
  }
  return <>{children}</>;
}