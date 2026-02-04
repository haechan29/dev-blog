import * as ProfileClientRepository from '@/features/user/data/repository/profileClientRepository';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useProfile() {
  const router = useRouter();

  const updateBioMutation = useMutation({
    mutationFn: (bio: string) => ProfileClientRepository.updateProfile({ bio }),
    onSuccess: () => router.refresh(),
  });

  const updateImageMutation = useMutation({
    mutationFn: (file: File) =>
      ProfileClientRepository.updateProfileImage(file),
    onSuccess: () => router.refresh(),
  });

  return { updateBioMutation, updateImageMutation };
}
