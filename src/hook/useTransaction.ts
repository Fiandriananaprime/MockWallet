import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/api/account.api';

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    staleTime: 15_000,
    retry: 1,
  });
}