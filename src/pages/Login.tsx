import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/api/auth.api';
import { useWalletAuth } from '@/lib/WalletAuth';
import { toApiError } from '@/lib/apiError';
import AuthShell from '@/components/wallet/AuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login: doLogin } = useWalletAuth();
  const navigate = useNavigate();
  const [msisdn, setMsisdn] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!msisdn.trim() || !password) {
      setError('Enter your number and password');
      return;
    }
    setLoading(true);
    try {
      const res = await login({ msisdn: msisdn.trim(), password });
      doLogin(res.accessToken);
      navigate('/account', { replace: true });
    } catch (err) {
      const apiErr = toApiError(err);
      setError(apiErr.status === 400 || apiErr.status === 401 ? 'Invalid credentials' : apiErr.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your mobile money wallet.">
      <Card>
        <form onSubmit={submit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="msisdn">MSISDN</Label>
              <Input
                id="msisdn"
                inputMode="tel"
                placeholder="0341234567"
                value={msisdn}
                onChange={(e) => setMsisdn(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Don't have a wallet?
          <Link to="/register" className="ml-1 font-medium text-foreground hover:underline">
            Create one
          </Link>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}