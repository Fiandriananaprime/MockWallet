import { Navigate } from 'react-router-dom';
import { useWalletAuth } from '@/lib/WalletAuth';

export default function Index() {
  const { isAuthenticated } = useWalletAuth();
  return <Navigate to={isAuthenticated ? '/account' : '/login'} replace />;
}