import * as ProfileClientRepository from '@/features/user/data/repository/profileClientRepository';
import { UserProps } from '@/features/user/ui/userProps';
import { userKeys } from '@/queries/keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useUser from './useUser';

export function useProfile(initialUser?: UserProps | null) {
  const queryClient = useQueryClient();

  const { user } = useUser(initialUser);

  const updateBioMutation = useMutation({
    mutationFn: (bio: string) => ProfileClientRepository.updateProfile({ bio }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: (file: File) =>
      ProfileClientRepository.updateProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });

  return { user, updateBioMutation, updateImageMutation };
}
