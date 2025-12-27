import { auth } from '@/auth';
import { UnauthorizedError } from '@/errors/errors';
import { UserEntity } from '@/features/user/data/entities/userEntities';
import { DuplicateNicknameError } from '@/features/user/data/errors/userErrors';
import { toDto } from '@/features/user/data/mapper/userMapper';
import { supabase, supabaseNextAuth } from '@/lib/supabase';
import { cookies } from 'next/headers';
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
        registered_at
      `
    )
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

export async function updateUser(nickname: string) {
  const userId = (await cookies()).get('userId')?.value;
  const authUserId = (await auth())?.user?.id;

  if (!userId || !authUserId) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }

  const { error } = await supabase
    .from('users')
    .update({
      nickname,
      deleted_at: null,
      auth_user_id: authUserId,
      registered_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    if (error.code === '23505') {
      throw new DuplicateNicknameError(nickname);
    }
    throw new Error(error.message);
  }
}

export async function deleteUser() {
  const session = await auth();
  if (!session) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }

  const userId = session.user?.user_id;
  if (!userId) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }

  const { error } = await supabase
    .from('users')
    .update({
      deleted_at: new Date().toISOString(),
      nickname: null,
    })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function hardDeleteAuthUser() {
  const session = await auth();
  const authUserId = session?.user?.id;
  if (!authUserId) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }

  const { error } = await supabaseNextAuth
    .from('users')
    .delete()
    .eq('id', authUserId);

  if (error) {
    throw new Error(error.message);
  }
}
