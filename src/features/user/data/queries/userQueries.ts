import { DuplicateNicknameError } from '@/features/user/data/errors/userErrors';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function createUser(userId: string, nickname: string) {
  const { data, error } = await supabase.from('users').insert({
    id: userId,
    nickname,
  });

  if (error) {
    if (error.code === '23505') {
      throw new DuplicateNicknameError(nickname);
    }

    throw new Error(error.message);
  }

  return data;
}
