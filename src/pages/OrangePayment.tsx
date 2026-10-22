import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock3, LockKeyhole, ShieldCheck, TriangleAlert } from 'lucide-react';
import { confirmOrangePayment, getOrangePaymentDetails } from '@/api/mockPayments.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toApiError } from '@/lib/apiError';
import type { OrangePaymentDetails } from '@/types';

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat('fr-MG', { style: 'currency', currency }).format(amount);

function friendlyError(error: unknown): string {
  const status = toApiError(error).status;
  if (status === 401) return 'Votre session a expiré. Reconnectez-vous pour continuer.';
  if (status === 403) return 'Ce paiement n’est pas destiné à ce portefeuille Orange Money.';
  if (status === 404) return 'Ce lien de paiement est introuvable.';
  if (status === 409) return 'Configurez d’abord votre PIN de paiement depuis votre portefeuille.';
  if (status === 410) return 'Ce lien de paiement a expiré.';
  if (status === 429) return 'Trop de tentatives incorrectes. Le paiement reste en attente ; réessayez dans cinq minutes.';
  if (status === 400) return 'PIN incorrect. Réessayez : le paiement est toujours en attente.';
  return 'Le paiement n’a pas pu être traité. Réessayez plus tard.';
}

export default function OrangePayment() {
  const { payToken = '' } = useParams();
  const [details, setDetails] = useState<OrangePaymentDetails | null>(null);
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
    getOrangePaymentDetails(payToken)
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
  }, [payToken]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError('');
    if (!/^\d{4}$/.test(pin)) {
      setActionError('Saisissez votre PIN de paiement à 4 chiffres.');
      return;
    }
    setSubmitting(true);
    try {
      await confirmOrangePayment(payToken, { pin });
      setApproved(true);
    } catch (error) {
      const status = toApiError(error).status;
      setActionError(friendlyError(error));
    } finally {
      setPin('');
      setSubmitting(false);
    }
  };

  const pending = details?.status === 'INITIATED' && !approved;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8f0] px-4 py-8 sm:py-14">
      <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="relative mx-auto max-w-xl">
        <Link to="/account" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-orange-950/65 hover:text-orange-950">
          <ArrowLeft className="h-4 w-4" /> Retour au portefeuille
        </Link>
        <Card className="overflow-hidden rounded-3xl border-orange-100 bg-white shadow-[0_24px_80px_-32px_rgba(124,45,18,0.35)]">
          <div className="bg-gradient-to-br from-[#ff8a00] via-[#f58220] to-[#e95d0f] px-6 py-7 text-white sm:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/35 bg-white/15 text-2xl font-black">O</span>
                <div>
                  <p className="text-xl font-bold tracking-tight">Orange Money</p>
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
                {loadError.includes('PIN') && (
                  <Button asChild variant="outline" className="mt-3 border-red-200 bg-white">
                    <Link to="/account">Configurer mon PIN</Link>
                  </Button>
                )}
                {loginRequired && <Link className="mt-3 inline-block underline" to="/login">Se reconnecter</Link>}
              </div>
            ) : details ? (
              <>
                <section className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-800/65">Vous payez</p>
                  <h1 className="mt-2 text-lg font-semibold text-slate-900">{details.receiverName || details.receiverMsisdn}</h1>
                  {details.receiverName && <p className="mt-1 text-sm text-slate-500">{details.receiverMsisdn}</p>}
                  <p className="mt-4 text-3xl font-bold tracking-tight text-orange-700 sm:text-4xl">
                    {formatAmount(details.amount, details.currency)}
                  </p>
                  <div className="mt-5 flex items-start justify-between gap-4 border-t border-orange-200/70 pt-4 text-sm">
                    <span className="text-slate-500">Référence</span>
                    <span className="max-w-[65%] break-all text-right font-semibold text-slate-800">{details.reference}</span>
                  </div>
                </section>

                {approved || details.status === 'SUCCESS' ? (
                  <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center text-emerald-900">
                    <CheckCircle2 className="mx-auto mb-2 h-8 w-8" />
                    <p className="font-semibold">Paiement confirmé</p>
                    <p className="mt-1 text-sm">Le paiement a été effectué avec succès.</p>
                  </div>
                ) : details.status === 'FAILED' || details.status === 'EXPIRED' ? (
                  <div role="status" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-red-900">
                    <TriangleAlert className="mx-auto mb-2 h-7 w-7" />
                    <p className="font-semibold">{details.status === 'EXPIRED' ? 'Demande expirée' : 'Paiement refusé'}</p>
                    {actionError && <p className="mt-1 text-sm">{actionError}</p>}
                  </div>
                ) : pending ? (
                  <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="orange-pin">Votre PIN de paiement</Label>
                      <Input
                        id="orange-pin"
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
                    <Button type="submit" className="h-12 w-full rounded-xl bg-[#f58220] text-base font-semibold text-white shadow-lg shadow-orange-600/20 hover:bg-[#df7015]" disabled={submitting}>
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
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Votre portefeuille connecté est utilisé pour confirmer.
                </p>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
