import { format as fnsFormat } from 'date-fns';

export function formatMoney(amount: number, currency = 'MGA'): string {
  return `${new Intl.NumberFormat('en-US').format(amount)} ${currency}`;
}

export function formatAmount(amount: number, currency = 'MGA'): string {
  return `${new Intl.NumberFormat('en-US').format(amount)} ${currency}`;
}

// 0341234567 -> "034 12 34 567"
export function formatMsisdn(msisdn: string): string {
  const digits = msisdn.replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
  }
  return msisdn;
}

export function formatDateTime(iso: string): string {
  try {
    return fnsFormat(new Date(iso), 'd MMM yyyy, HH:mm');
  } catch {
    return iso;
  }
}