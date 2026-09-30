import { useTransactions } from '@/hook/useTransaction';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatMoney, formatDateTime } from '@/utils/format';
import { EmptyState, ErrorState } from './states';
import { ArrowDownLeft, ArrowUpRight, Inbox } from 'lucide-react';
import type { TransactionResponse, TransactionType, TransactionStatus } from '@/types';

const TYPE_BADGE: Record<TransactionType, string> = {
  TOPUP: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  PAYMENT: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  RESET: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  REFUND: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
};

const STATUS_BADGE: Record<TransactionStatus, string> = {
  SUCCESS: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  FAILED: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
};

function isCredit(type: TransactionType): boolean {
  return type === 'TOPUP' || type === 'REFUND';
}

function Amount({ tx, currency }: { tx: TransactionResponse; currency: string }) {
  const credit = isCredit(tx.type);
  return (
    <span className={`inline-flex items-center font-semibold tabular-nums ${credit ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
      {credit ? (
        <ArrowDownLeft className="mr-1 h-3.5 w-3.5" />
      ) : (
        <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
      )}
      {credit ? '+' : '-'}
      {formatMoney(Math.abs(tx.amount), currency)}
    </span>
  );
}

export default function TransactionTable({ limit }: { limit?: number } = {}) {
  const { data, isLoading, isError, error, refetch, isFetching } = useTransactions();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState description="We couldn't load your transactions." onRetry={() => refetch()} />;
  }

  const all = data ?? [];
  const rows = limit ? all.slice(0, limit) : all;

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No transactions yet"
        description="Your top-ups, payments and resets will appear here."
      />
    );
  }

  const currency = 'MGA';

  return (
    <div className="space-y-3">
      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Balance before</TableHead>
              <TableHead className="text-right">Balance after</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((tx, i) => (
              <TableRow key={tx.id ?? tx.reference ?? i}>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {formatDateTime(tx.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={TYPE_BADGE[tx.type]}>
                    {tx.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Amount tx={tx} currency={tx.currency ?? currency} />
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={STATUS_BADGE[tx.status]}>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                  {formatMoney(tx.balanceBefore, tx.currency ?? currency)}
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums font-medium">
                  {formatMoney(tx.balanceAfter, tx.currency ?? currency)}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{tx.reference}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2.5">
        {rows.map((tx, i) => (
          <div key={tx.id ?? tx.reference ?? i} className="rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={TYPE_BADGE[tx.type]}>
                  {tx.type}
                </Badge>
                <Badge variant="secondary" className={STATUS_BADGE[tx.status]}>
                  {tx.status}
                </Badge>
              </div>
              <Amount tx={tx} currency={tx.currency ?? currency} />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatDateTime(tx.createdAt)}</span>
              <span className="font-mono">{tx.reference}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Balance</span>
              <span className="tabular-nums">
                {formatMoney(tx.balanceBefore, tx.currency ?? currency)} →{' '}
                <span className="font-medium text-foreground">
                  {formatMoney(tx.balanceAfter, tx.currency ?? currency)}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {isFetching && !isLoading && (
        <p className="text-center text-xs text-muted-foreground">Refreshing…</p>
      )}
    </div>
  );
}