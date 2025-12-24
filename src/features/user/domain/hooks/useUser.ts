'use client';

import * as UserAction from '@/features/user/domain/action/userAction';
import * as UserClientService from '@/features/user/domain/service/userClientService';
import { userKeys } from '@/queries/keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function useUser() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: userKeys.me(),
    queryFn: () => UserClientService.fetchUser(),
  });

  const createUserMutation = useMutation({
    mutationFn: () => UserAction.createUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me(),
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (params: { nickname: string }) =>
      UserClientService.updateUser(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me(),
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: () => UserClientService.deleteUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me(),
      });
    },
  });

  return {
    user,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  } as const;
}
