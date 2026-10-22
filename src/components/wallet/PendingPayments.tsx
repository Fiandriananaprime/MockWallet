import { useCallback, useEffect, useState } from 'react';
import { Clock3, ExternalLink, LoaderCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMvolaIncomingRequests, getOrangeIncomingRequests } from '@/api/mockPayments.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { PendingPaymentRequest, Provider } from '@/types';

function failureMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Impossible de charger les paiements en attente.';
}

function formatAmount(amount: number, currency: string): string {
  const currencyCode = currency === 'Ar' ? 'MGA' : currency;
  try {
    return new Intl.NumberFormat('fr-MG', { style: 'currency', currency: currencyCode }).format(amount);
  } catch {
    return `${new Intl.NumberFormat('fr-MG').format(amount)} ${currency}`;
  }
}

export default function PendingPayments({ provider }: { provider: Provider }) {
  const [requests, setRequests] = useState<PendingPaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshError, setRefreshError] = useState('');

  const refresh = useCallback(async () => {
    setRefreshError('');
    try {
      if (provider === 'MVOLA') {
        const result = await getMvolaIncomingRequests();
        setRequests(result.requests.map((request) => ({ ...request, provider })));
      } else {
        const result = await getOrangeIncomingRequests();
        setRequests(result.requests.map((request) => ({
          ...request,
          provider,
          serverCorrelationId: request.payToken,
        })));
      }
    } catch (error) {
      setRefreshError(failureMessage(error));
    } finally {
      setLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 15_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const providerLabel = provider === 'MVOLA' ? 'MVola' : 'Orange Money';
  const color = provider === 'MVOLA' ? '#008f6c' : '#f58220';

  return (
    <section aria-labelledby="pending-payments-title" className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl text-sm font-black text-white" style={{ backgroundColor: color }}>
              {provider === 'MVOLA' ? 'M' : 'O'}
            </span>
            <h2 id="pending-payments-title" className="text-lg font-semibold">Paiements en attente</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Demandes adressées à votre portefeuille {providerLabel}.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void refresh()} disabled={loading}>
          <RefreshCw className="h-4 w-4" /> Actualiser
        </Button>
      </div>
      {refreshError && (
        <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <p>{refreshError}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => void refresh()}>Réessayer</Button>
        </div>
      )}
      {loading ? (
        <Card><CardContent className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground"><LoaderCircle className="h-4 w-4 animate-spin" /> Chargement…</CardContent></Card>
      ) : !refreshError && requests.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Aucun paiement en attente.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => {
            const paymentPath = provider === 'MVOLA'
              ? `/mvola/pay/${encodeURIComponent(request.serverCorrelationId)}`
              : `/orange/pay/${encodeURIComponent(request.serverCorrelationId)}`;
            return (
              <Card key={request.serverCorrelationId} className="border-l-4" style={{ borderLeftColor: color }}>
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{request.receiverName || request.receiverMsisdn}</p>
                      {request.receiverName && <p className="mt-1 text-sm text-muted-foreground">{request.receiverMsisdn}</p>}
                      <p className="mt-1 text-sm text-muted-foreground">Référence : {request.reference}</p>
                    </div>
                    <p className="text-xl font-bold tabular-nums" style={{ color }}>{formatAmount(request.amount, request.currency)}</p>
                  </div>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock3 className="h-4 w-4" /> Expire le {new Date(request.expiresAt).toLocaleString('fr-MG')}
                  </p>
                  <Button asChild className="w-full text-white hover:opacity-90" style={{ backgroundColor: color }}>
                    <Link to={paymentPath}>
                      Voir et confirmer <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
