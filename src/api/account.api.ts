import { apiClient } from './client';
import type {
  AccountResponse,
  BalanceResponse,
  TopUpRequest,
  AccountTransactionListResponse,
  TransactionResponse,
} from '@/types';

export async function getAccount(): Promise<AccountResponse> {
  const { data } = await apiClient.get<AccountResponse>('/account');
  return data;
}

export async function getBalance(): Promise<BalanceResponse> {
  const { data } = await apiClient.get<BalanceResponse>('/account/balance');
  return data;
}

export async function getTransactions(): Promise<TransactionResponse[]> {
  const { data } = await apiClient.get<AccountTransactionListResponse | TransactionResponse[]>(
    '/account/transactions',
  );
  // Tolerate both an array and a { transactions: [] } envelope.
  if (Array.isArray(data)) return data;
  return data.transactions ?? [];
}

export async function topUp(payload: TopUpRequest): Promise<AccountResponse> {
  const { data } = await apiClient.post<AccountResponse>('/account/topup', payload);
  return data;
}

export async function resetWallet(): Promise<AccountResponse> {
  const { data } = await apiClient.post<AccountResponse>('/account/reset');
  return data;
}