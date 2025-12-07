'use client';

import * as UserClientService from '@/features/user/domain/service/userClientService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function useUser() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => UserClientService.fetchUser(),
  });

  const updateUserMutation = useMutation({
    mutationFn: (params: { nickname: string }) =>
      UserClientService.updateUser(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: () => UserClientService.deleteUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
    },
  });

  return {
    user,
    updateUserMutation,
    deleteUserMutation,
  } as const;
}
