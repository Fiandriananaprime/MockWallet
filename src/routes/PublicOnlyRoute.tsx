import { Navigate } from 'react-router-dom';
import { useWalletAuth } from '@/lib/WalletAuth';
import type { ReactNode } from 'react';

// Redirect authenticated users away from public-only pages (login/register).
export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useWalletAuth();
  if (isAuthenticated) return <Navigate to="/account" replace />;
  return <>{children}</>;
}