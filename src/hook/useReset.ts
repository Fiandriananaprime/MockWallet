import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { resetWallet } from '@/api/account.api';
import { toApiError } from '@/lib/apiError';

export function useResetWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resetWallet(),
    onSuccess: (account) => {
      queryClient.invalidateQueries({ queryKey: ['account'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.setQueryData(['account'], account);
      toast.success('Wallet reset', {
        description: 'Your balance is now 0 MGA.',
      });
    },
    onError: (error) => {
      const { message } = toApiError(error);
      toast.error('Reset failed', { description: message });
    },
  });
}