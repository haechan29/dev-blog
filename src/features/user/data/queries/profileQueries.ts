import { auth } from '@/auth';
import { UnauthorizedError } from '@/errors/errors';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import 'server-only';

export async function updateProfile({
  profileImageUrl,
  bio,
}: {
  profileImageUrl?: string | null;
  bio?: string | null;
}) {
  const userId = (await cookies()).get('userId')?.value;
  const authUserId = (await auth())?.user?.id;

  if (!userId || !authUserId) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }

  const { error } = await supabase
    .from('users')
    .update({
      ...(profileImageUrl !== undefined && {
        profile_image_url: profileImageUrl,
      }),
      ...(bio !== undefined && { bio }),
    })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
}
