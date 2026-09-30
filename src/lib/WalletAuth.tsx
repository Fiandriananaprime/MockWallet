import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { getToken, setToken, clearToken } from '@/lib/token';

interface WalletAuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const WalletAuthContext = createContext<WalletAuthContextValue | undefined>(undefined);

export function WalletAuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getToken());

  const login = useCallback((t: string) => {
    setToken(t);
    setTokenState(t);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
  }, []);

  return (
    <WalletAuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </WalletAuthContext.Provider>
  );
}

export function useWalletAuth(): WalletAuthContextValue {
  const ctx = useContext(WalletAuthContext);
  if (!ctx) throw new Error('useWalletAuth must be used within a WalletAuthProvider');
  return ctx;
}