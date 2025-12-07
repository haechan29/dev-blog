import { UserEntity } from '@/features/user/data/entities/userEntities';
import { DuplicateNicknameError } from '@/features/user/data/errors/userErrors';
import { toDto } from '@/features/user/data/mapper/userMapper';
import { supabase, supabaseNextAuth } from '@/lib/supabase';
import 'server-only';

export async function fetchUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, nickname, created_at, updated_at, deleted_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toDto(data as unknown as UserEntity) : null;
}

export async function createUser() {
  const { data, error } = await supabase
    .from('users')
    .insert({ nickname: null, auth_user_id: null })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id as string;
}

export async function updateUser(
  userId: string,
  nickname: string,
  authUserId?: string
) {
  const { error } = await supabase
    .from('users')
    .update({
      nickname,
      ...(authUserId !== undefined && { auth_user_id: authUserId }),
    })
    .eq('id', userId);

  if (error) {
    if (error.code === '23505') {
      throw new DuplicateNicknameError(nickname);
    }
    throw new Error(error.message);
  }
}

export async function deleteUser(userId: string) {
  const { error } = await supabase
    .from('users')
    .update({ deleted_at: new Date().toISOString(), nickname: null })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function hardDeleteAuthUser(userId: string) {
  const { error } = await supabaseNextAuth
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
}
