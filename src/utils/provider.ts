import type { Provider } from '@/types';

export const PROVIDER_LABEL: Record<Provider, string> = {
  MVOLA: 'MVola',
  ORANGE_MONEY: 'Orange Money',
};

export const PROVIDER_WALLET_LABEL: Record<Provider, string> = {
  MVOLA: 'MVola Wallet',
  ORANGE_MONEY: 'Orange Money Wallet',
};

export interface ProviderTheme {
  name: string;
  dot: string;
  text: string;
  ring: string;
  gradient: string;
  badge: string;
  solid: string;
}

// Literal class strings so Tailwind's purge keeps them.
export const PROVIDER_THEME: Record<Provider, ProviderTheme> = {
  MVOLA: {
    name: 'MVola',
    dot: 'bg-amber-400',
    text: 'text-amber-600',
    ring: 'ring-amber-400/40',
    gradient: 'from-amber-500 via-yellow-500 to-amber-600',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    solid: 'bg-amber-500 text-white',
  },
  ORANGE_MONEY: {
    name: 'Orange Money',
    dot: 'bg-orange-500',
    text: 'text-orange-600',
    ring: 'ring-orange-400/40',
    gradient: 'from-orange-500 via-orange-500 to-orange-600',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
    solid: 'bg-orange-500 text-white',
  },
};

export function providerTheme(provider: Provider): ProviderTheme {
  return PROVIDER_THEME[provider] ?? PROVIDER_THEME.MVOLA;
}