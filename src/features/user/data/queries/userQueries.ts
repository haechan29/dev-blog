import { UserEntity } from '@/features/user/data/entities/userEntities';
import { DuplicateNicknameError } from '@/features/user/data/errors/userErrors';
import { toDto } from '@/features/user/data/mapper/userMapper';
import { supabase, supabaseNextAuth } from '@/lib/supabase';
import 'server-only';

export async function fetchUser(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
        id,
        nickname,
        created_at,
        updated_at,
        deleted_at,
        registered_at,
        profile_image_url,
        bio,
        subscriber_count
      `
    )
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toDto(data as unknown as UserEntity) : null;
}

export async function createUser(nickname: string | null = null) {
  const { data, error } = await supabase
    .from('users')
    .insert({ nickname, auth_user_id: null })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id as string;
}

export async function updateUser({
  userId,
  userIdFromSession,
  nickname,
  subscriberCount,
  registeredAt,
  deletedAt,
}: {
  userId: string;
  userIdFromSession?: string;
  nickname?: string | null;
  subscriberCount?: number;
  registeredAt?: string | null;
  deletedAt?: string | null;
}) {
  const { error } = await supabase
    .from('users')
    .update({
      ...(nickname !== undefined && { nickname }),
      ...(userIdFromSession !== undefined && {
        auth_user_id: userIdFromSession,
      }),
      ...(subscriberCount !== undefined && {
        subscriber_count: subscriberCount,
      }),
      ...(registeredAt !== undefined && { registered_at: registeredAt }),
      ...(deletedAt !== undefined && { deleted_at: deletedAt }),
    })
    .eq('id', userId);

  if (error) {
    if (!!nickname && error.code === '23505') {
      throw new DuplicateNicknameError(nickname);
    }
    throw new Error(error.message);
  }
}

export async function deleteUserFromAuth(userIdFromSession: string) {
  const { error } = await supabaseNextAuth
    .from('users')
    .delete()
    .eq('id', userIdFromSession);

  if (error) {
    throw new Error(error.message);
  }
}
