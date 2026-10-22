import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock3, KeyRound, LockKeyhole, ShieldCheck, TriangleAlert } from 'lucide-react';
import { authorizeMvolaRequest, getMvolaPaymentDetails } from '@/api/mockPayments.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toApiError } from '@/lib/apiError';
import type { MvolaPaymentDetails } from '@/types';

const formatAmount = (amount: number, currency: string) => {
  const currencyCode = currency === 'Ar' ? 'MGA' : currency;
  try {
    return new Intl.NumberFormat('fr-MG', { style: 'currency', currency: currencyCode }).format(amount);
  } catch {
    return `${new Intl.NumberFormat('fr-MG').format(amount)} ${currency}`;
  }
};

function friendlyError(error: unknown): string {
  const status = toApiError(error).status;
  if (status === 401) return 'Votre session a expiré. Reconnectez-vous pour continuer.';
  if (status === 403) return 'Ce paiement n’est pas destiné à ce portefeuille MVola.';
  if (status === 404) return 'Cette demande de paiement est introuvable.';
  if (status === 409) return 'Configurez d’abord votre PIN de paiement depuis votre portefeuille.';
  if (status === 410) return 'Cette demande a expiré.';
  if (status === 429) return 'Trop de tentatives incorrectes. Le paiement reste en attente ; réessayez dans cinq minutes.';
  if (status === 400) return 'PIN incorrect. Réessayez : le paiement est toujours en attente.';
  return 'Le paiement n’a pas pu être traité. Réessayez plus tard.';
}

export default function MvolaPayment() {
  const { serverCorrelationId = '' } = useParams();
  const [details, setDetails] = useState<MvolaPaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [loginRequired, setLoginRequired] = useState(false);
  const [pin, setPin] = useState('');
  const [actionError, setActionError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');
    setLoginRequired(false);
    setDetails(null);
    getMvolaPaymentDetails(serverCorrelationId)
      .then((result) => {
        if (active) setDetails(result);
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(friendlyError(error));
          setLoginRequired(toApiError(error).status === 401);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [serverCorrelationId]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError('');
    if (!/^\d{4}$/.test(pin)) {
      setActionError('Saisissez votre PIN de paiement à 4 chiffres.');
      return;
    }
    setSubmitting(true);
    try {
      await authorizeMvolaRequest(serverCorrelationId, { pin });
      setApproved(true);
    } catch (error) {
      setActionError(friendlyError(error));
    } finally {
      setPin('');
      setSubmitting(false);
    }
  };

  const pending = details?.status === 'pending' && !approved;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#effbf6] px-4 py-8 sm:py-14">
      <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="relative mx-auto max-w-xl">
        <Link to="/account" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-950/65 hover:text-emerald-950">
          <ArrowLeft className="h-4 w-4" /> Retour au portefeuille
        </Link>
        <Card className="overflow-hidden rounded-3xl border-emerald-100 bg-white shadow-[0_24px_80px_-32px_rgba(6,78,59,0.32)]">
          <div className="bg-gradient-to-br from-[#0aa77d] via-[#008f6c] to-[#006d53] px-6 py-7 text-white sm:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/35 bg-white/15 text-2xl font-black">M</span>
                <div>
                  <p className="text-xl font-bold tracking-tight">MVola</p>
                  <p className="text-sm text-white/80">Confirmation de paiement</p>
                </div>
              </div>
              <ShieldCheck className="h-7 w-7 text-white/85" />
            </div>
          </div>
          <CardContent className="space-y-6 p-5 sm:p-8">
            {loading ? (
              <p className="py-12 text-center text-sm text-muted-foreground">Chargement des détails…</p>
            ) : loadError ? (
              <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p>{loadError}</p>
                {loginRequired ? (
                  <Button asChild variant="outline" className="mt-3 border-red-200 bg-white">
                    <Link to="/login">Se connecter</Link>
                  </Button>
                ) : loadError.includes('PIN') ? (
                  <Button asChild variant="outline" className="mt-3 border-red-200 bg-white">
                    <Link to="/account">Configurer mon PIN</Link>
                  </Button>
                ) : null}
              </div>
            ) : details ? (
              <>
                <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800/65">Vous payez</p>
                  <h1 className="mt-2 text-lg font-semibold text-slate-900">{details.receiverName || details.receiverMsisdn}</h1>
                  {details.receiverName && <p className="mt-1 text-sm text-slate-500">{details.receiverMsisdn}</p>}
                  <p className="mt-4 text-3xl font-bold tracking-tight text-emerald-700 sm:text-4xl">
                    {formatAmount(details.amount, details.currency)}
                  </p>
                  <div className="mt-5 flex items-start justify-between gap-4 border-t border-emerald-200/70 pt-4 text-sm">
                    <span className="text-slate-500">Référence</span>
                    <span className="max-w-[65%] break-all text-right font-semibold text-slate-800">{details.reference}</span>
                  </div>
                </section>
                {approved || details.status === 'completed' ? (
                  <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center text-emerald-900">
                    <CheckCircle2 className="mx-auto mb-2 h-8 w-8" />
                    <p className="font-semibold">Paiement confirmé</p>
                    <p className="mt-1 text-sm">Le paiement a été effectué avec succès.</p>
                  </div>
                ) : details.status === 'failed' ? (
                  <div role="status" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-red-900">
                    <TriangleAlert className="mx-auto mb-2 h-7 w-7" />
                    <p className="font-semibold">Paiement refusé</p>
                    {actionError && <p className="mt-1 text-sm">{actionError}</p>}
                  </div>
                ) : pending ? (
                  <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mvola-pin">Votre PIN de paiement</Label>
                      <Input
                        id="mvola-pin"
                        type="password"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]{4}"
                        maxLength={4}
                        placeholder="••••"
                        value={pin}
                        onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
                        disabled={submitting}
                        required
                        className="h-12 text-center text-xl tracking-[0.6em]"
                      />
                    </div>
                    {actionError && (
                      <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                        <p>{actionError}</p>
                        {actionError.includes('PIN') && <Link className="mt-2 inline-block font-semibold underline" to="/account">Configurer mon PIN</Link>}
                      </div>
                    )}
                    <Button type="submit" className="h-12 w-full rounded-xl bg-[#008f6c] text-base font-semibold text-white shadow-lg shadow-emerald-700/20 hover:bg-[#00785b]" disabled={submitting}>
                      <LockKeyhole className="h-4 w-4" /> {submitting ? 'Confirmation…' : 'Confirmer le paiement'}
                    </Button>
                    <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" /> Expire le {new Date(details.expiresAt).toLocaleString('fr-MG')}
                    </p>
                  </form>
                ) : (
                  <div className="rounded-2xl border bg-slate-50 p-4 text-center text-sm text-slate-700">
                    Cette demande n’est plus en attente : {details.status}
                  </div>
                )}
                <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <KeyRound className="h-4 w-4 text-emerald-600" /> Votre portefeuille connecté est utilisé pour confirmer.
                </p>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
