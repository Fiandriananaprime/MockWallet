import { Navigate, Outlet } from 'react-router-dom';
import { useWalletAuth } from '@/lib/WalletAuth';

export default function WalletProtectedRoute() {
  const { isAuthenticated } = useWalletAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}