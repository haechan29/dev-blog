import { supabase } from '@/lib/supabase';
import 'server-only';

export async function updateProfile({
  userId,
  profileImageUrl,
  bio,
}: {
  userId: string;
  profileImageUrl?: string | null;
  bio?: string | null;
}) {
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
