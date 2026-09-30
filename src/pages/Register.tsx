import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '@/api/auth.api';
import { toApiError } from '@/lib/apiError';
import AuthShell from '@/components/wallet/AuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';
import { PROVIDER_LABEL, providerTheme } from '@/utils/provider';
import { formatMsisdn, formatMoney } from '@/utils/format';
import type { Provider, RegisterResponse } from '@/types';

const PROVIDERS: Provider[] = ['MVOLA', 'ORANGE_MONEY'];

export default function Register() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider>('MVOLA');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<RegisterResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password) {
      setError('Enter a password');
      return;
    }
    if (password.length < 4) {
      setError('Password is too short');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await register({ provider, password });
      // The backend may return a generated password — we deliberately ignore
      // it and never display or persist it.
      setCreated(res);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const copyNumber = async () => {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.msisdn);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (created) {
    const theme = providerTheme(created.provider);
    return (
      <AuthShell
        title="Your wallet has been created"
        subtitle="Save your number — you'll need it to sign in."
      >
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${theme.dot}`} />
              <span className="font-medium">{PROVIDER_LABEL[created.provider]}</span>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Your number
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <code className="rounded-lg border bg-muted px-3 py-2 text-lg font-semibold tracking-tight">
                  {formatMsisdn(created.msisdn)}
                </code>
                <Button type="button" size="icon" variant="outline" onClick={copyNumber}>
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm text-muted-foreground">Balance</span>
              <span className="font-semibold tabular-nums">
                {formatMoney(created.balance, created.currency)}
              </span>
            </div>

            <Button className="w-full" onClick={() => navigate('/login')}>
              Continue to login
            </Button>
          </CardContent>
        </Card>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your wallet"
      subtitle="Choose a provider and set a password. We'll generate your number."
    >
      <Card>
        <form onSubmit={submit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select value={provider} onValueChange={(v) => setProvider(v as Provider)}>
                <SelectTrigger id="provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDERS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PROVIDER_LABEL[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type={show ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating…' : 'Create wallet'}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Already have a wallet?
          <Link to="/login" className="ml-1 font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}