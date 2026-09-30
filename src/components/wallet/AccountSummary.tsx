import { Smartphone } from 'lucide-react';
import { useAccount } from '@/hook/useAccount';
import { providerTheme, PROVIDER_WALLET_LABEL } from '@/utils/provider';
import { formatMoney, formatMsisdn } from '@/utils/format';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountSummary() {
  const { data, isLoading, isError } = useAccount();

  if (isError) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="text-sm font-semibold">Wallet</span>
        </div>
        <div className="text-xs text-muted-foreground">Account unavailable</div>
        <div className="pt-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Balance</div>
          <div className="text-xl font-semibold tabular-nums text-muted-foreground">—</div>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-7 w-28" />
      </div>
    );
  }

  const theme = providerTheme(data.provider);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} />
        <span className="text-sm font-semibold">{PROVIDER_WALLET_LABEL[data.provider]}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Smartphone className="h-3.5 w-3.5" />
        <span className="font-mono tracking-tight">{formatMsisdn(data.msisdn)}</span>
      </div>
      <div className="pt-2">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Balance</div>
        <div className="text-xl font-semibold tabular-nums">{formatMoney(data.balance, data.currency)}</div>
      </div>
    </div>
  );
}