import * as ProfileClientRepository from '@/features/user/data/repository/profileClientRepository';
import { UserProps } from '@/features/user/ui/userProps';
import { userKeys } from '@/queries/keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useProfile(initialUser?: UserProps | null) {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: userKeys.user(initialUser?.id ?? ''),
    queryFn: () => Promise.resolve(initialUser), // TODO: userId 기반 fetch API로 교체
    initialData: initialUser,
    enabled: !!initialUser?.id,
  });

  const updateBioMutation = useMutation({
    mutationFn: (bio: string) => ProfileClientRepository.updateProfile({ bio }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.user(initialUser?.id ?? ''),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: (file: File) =>
      ProfileClientRepository.updateProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.user(initialUser?.id ?? ''),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });

  return { user, updateBioMutation, updateImageMutation };
}
