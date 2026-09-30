// Mock Mobile Money Service — user wallet frontend
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import { WalletAuthProvider } from '@/lib/WalletAuth';
import WalletProtectedRoute from '@/routes/ProtectedRoute';
import PublicOnlyRoute from '@/routes/PublicOnlyRoute';
import WalletShell from '@/components/wallet/WalletShell';
import Login from '@/pages/Login.tsx';
import Register from '@/pages/Register.tsx';
import Dashboard from '@/pages/Dashboard.tsx';
import Transactions from '@/pages/Transaction.tsx';
import IndexPage from '@/pages/Index.tsx';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <WalletAuthProvider>
              <Routes>
                <Route
                  path="/login"
                  element={
                    <PublicOnlyRoute>
                      <Login />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicOnlyRoute>
                      <Register />
                    </PublicOnlyRoute>
                  }
                />
                <Route path="/" element={<IndexPage />} />

                <Route element={<WalletProtectedRoute />}>
                  <Route element={<WalletShell />}>
                    <Route path="/account" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                  </Route>
                </Route>

                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </WalletAuthProvider>
          </Router>
          <Toaster />
          <SonnerToaster richColors position="top-right" closeButton />
        </QueryClientProvider>
      </ThemeProvider>
  );
}

export default App;