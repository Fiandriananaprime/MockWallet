import { useQuery } from '@tanstack/react-query';
import { getBalance } from '@/api/account.api';

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: getBalance,
    staleTime: 30_000,
    retry: 1,
  });
}