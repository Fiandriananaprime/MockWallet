import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useWalletAuth } from '@/lib/WalletAuth';

export default function WalletProtectedRoute() {
  const { isAuthenticated } = useWalletAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}