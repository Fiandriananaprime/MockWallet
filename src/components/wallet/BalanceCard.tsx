import { Plus, RotateCcw, ShieldCheck, ShieldAlert, Smartphone } from 'lucide-react';
import { useAccount } from '@/hook/useAccount';
import { providerTheme, PROVIDER_WALLET_LABEL } from '@/utils/provider';
import { formatMoney, formatMsisdn } from '@/utils/format';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { ErrorState } from './states';
import { toApiError } from '@/lib/apiError';

interface Props {
  onTopUp: () => void;
  onReset: () => void;
}

export default function BalanceCard({ onTopUp, onReset }: Props) {
  const { data, isLoading, isError, error, refetch } = useAccount();

  if (isError) {
    const apiErr = toApiError(error);
    const blocked = apiErr.status === 403;
    return (
      <div className="rounded-2xl border bg-card p-6">
        <ErrorState
          title={blocked ? 'Your account is blocked' : 'Unable to load your account'}
          description={blocked ? undefined : apiErr.message}
          onRetry={blocked ? undefined : () => refetch()}
        />
      </div>
    );
  }

  if (isLoading || !data) {
    return <Skeleton className="h-56 w-full rounded-2xl" />;
  }

  const theme = providerTheme(data.provider);
  const active = String(data.status).toUpperCase() === 'ACTIVE';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${theme.gradient} p-6 text-white shadow-sm md:p-8`}
    >
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-white/90">
            <span className="h-2.5 w-2.5 rounded-full bg-white" />
            {PROVIDER_WALLET_LABEL[data.provider]}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
            <Smartphone className="h-3.5 w-3.5" />
            <span className="font-mono tracking-tight">{formatMsisdn(data.msisdn)}</span>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            active ? 'bg-white/20 text-white' : 'bg-black/20 text-white'
          }`}
        >
          {active ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
          {String(data.status).toUpperCase()}
        </span>
      </div>

      <div className="relative mt-8">
        <div className="text-xs uppercase tracking-wider text-white/70">Current balance</div>
        <div className="mt-1 text-4xl font-semibold tabular-nums md:text-5xl">
          {formatMoney(data.balance, data.currency)}
        </div>
      </div>

      <div className="relative mt-8 flex flex-col gap-2 sm:flex-row">
        <Button
          variant="secondary"
          className="flex-1 bg-white text-foreground hover:bg-white/90"
          onClick={onTopUp}
        >
          <Plus className="h-4 w-4" /> Top Up
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
          onClick={onReset}
        >
          <RotateCcw className="h-4 w-4" /> Reset wallet
        </Button>
      </div>
    </div>
  );
}