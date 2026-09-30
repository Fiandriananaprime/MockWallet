import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { topUp } from '@/api/account.api';
import type { TopUpRequest } from '@/types';

export function useTopUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TopUpRequest) => topUp(payload),
    onSuccess: (account) => {
      queryClient.invalidateQueries({ queryKey: ['account'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.setQueryData(['account'], account);
      toast.success('Top-up successful', {
        description: `New balance: ${new Intl.NumberFormat('en-US').format(account.balance)} ${account.currency}`,
      });
    },
  });
}