import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useAccount } from '@/hook/useAccount';
import { useResetWallet } from '@/hook/useReset';
import { formatMoney } from '@/utils/format';
import type { MouseEvent } from 'react';

export default function ResetDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { data } = useAccount();
  const reset = useResetWallet();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset wallet?</AlertDialogTitle>
          <AlertDialogDescription>
            Your current balance is{' '}
            <span className="font-semibold text-foreground">
              {data ? formatMoney(data.balance, data.currency) : '…'}
            </span>
            . This will reset your wallet balance to 0.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={reset.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={reset.isPending}
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              reset.mutate(undefined, { onSuccess: () => onOpenChange(false) });
            }}
          >
            {reset.isPending ? 'Resetting…' : 'Reset wallet'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}