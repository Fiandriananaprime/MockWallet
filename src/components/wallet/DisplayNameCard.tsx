import { useEffect, useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, Save } from 'lucide-react';
import { updateDisplayName } from '@/api/account.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toApiError } from '@/lib/apiError';

export default function DisplayNameCard({ currentName }: { currentName: string | null }) {
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState(currentName ?? '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => setDisplayName(currentName ?? ''), [currentName]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);
    try {
      const result = await updateDisplayName(displayName.trim());
      setDisplayName(result.displayName ?? '');
      setMessage(result.displayName ? 'Nom du portefeuille enregistré.' : 'Nom supprimé ; le numéro sera affiché aux payeurs.');
      await queryClient.invalidateQueries({ queryKey: ['account'] });
    } catch (cause) {
      setError(toApiError(cause).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold">Nom du portefeuille</h2>
        <p className="mt-1 text-sm text-muted-foreground">Ce nom apparaît aux personnes qui vous envoient un paiement.</p>
      </div>
      <CardContent className="p-5">
        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="account-display-name">Nom affiché (facultatif)</Label>
            <Input
              id="account-display-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value.slice(0, 80))}
              maxLength={80}
              placeholder="Par exemple, NovaMarket"
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Enregistrer
          </Button>
        </form>
        {message && <p role="status" className="mt-3 text-sm text-emerald-700">{message}</p>}
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
