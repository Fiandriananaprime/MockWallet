import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTopUp } from '@/hook/useTopUp';
import { toApiError } from '@/lib/apiError';
import { formatMoney } from '@/utils/format';

const QUICK = [100000, 500000, 1000000];

export default function TopUpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [amount, setAmount] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const topUp = useTopUp();

  useEffect(() => {
    if (open) {
      setAmount('');
      setError(null);
    }
  }, [open]);

  const submit = () => {
    const value = typeof amount === 'number' ? amount : Number(amount);
    if (!value || value <= 0 || !Number.isFinite(value)) {
      setError('Enter a valid amount in MGA');
      return;
    }
    setError(null);
    topUp.mutate(
      { amount: Math.round(value) },
      {
        onSuccess: () => onOpenChange(false),
        onError: (e) => setError(toApiError(e).message),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Top up your wallet</DialogTitle>
          <DialogDescription>Choose a quick amount or enter a custom value.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          {QUICK.map((q) => (
            <Button
              key={q}
              type="button"
              variant={amount === q ? 'default' : 'outline'}
              onClick={() => {
                setAmount(q);
                setError(null);
              }}
            >
              {formatMoney(q)}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="topup-amount">Custom amount (MGA)</Label>
          <Input
            id="topup-amount"
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={topUp.isPending}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={topUp.isPending}>
            {topUp.isPending ? 'Processing…' : 'Top up'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}