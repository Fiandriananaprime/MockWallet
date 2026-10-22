import { useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { KeyRound, LoaderCircle, ShieldCheck } from 'lucide-react';
import { configurePin } from '@/api/account.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toApiError } from '@/lib/apiError';

export default function PinSetupCard() {
  const queryClient = useQueryClient();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!/^\d{4}$/.test(pin)) {
      setError('Choose a PIN with exactly four digits.');
      return;
    }
    if (pin !== confirmPin) {
      setError('The PINs do not match.');
      return;
    }
    setSaving(true);
    try {
      await configurePin(pin);
      await queryClient.invalidateQueries({ queryKey: ['account'] });
    } catch (cause) {
      const apiError = toApiError(cause);
      setError(apiError.status === 409 ? 'A payment PIN is already configured for this wallet.' : apiError.message);
    } finally {
      setPin('');
      setConfirmPin('');
      setSaving(false);
    }
  };

  return (
    <Card className="overflow-hidden border-amber-200 bg-gradient-to-br from-white to-amber-50/70">
      <div className="flex items-center gap-3 border-b border-amber-100 px-5 py-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-800">
          <KeyRound className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-semibold">Set up your payment PIN</h2>
          <p className="text-sm text-muted-foreground">A 4-digit PIN is needed to approve payments.</p>
        </div>
      </div>
      <CardContent className="p-5">
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="wallet-pin">New 4-digit PIN</Label>
            <Input
              id="wallet-pin"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              pattern="[0-9]{4}"
              maxLength={4}
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wallet-pin-confirm">Confirm PIN</Label>
            <Input
              id="wallet-pin-confirm"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              pattern="[0-9]{4}"
              maxLength={4}
              value={confirmPin}
              onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
              required
            />
          </div>
          <Button type="submit" className="bg-amber-600 text-white hover:bg-amber-700" disabled={saving}>
            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {saving ? 'Saving…' : 'Save PIN'}
          </Button>
        </form>
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
