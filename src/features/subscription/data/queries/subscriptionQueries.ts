import {
  UnauthorizedError,
  ValidationError,
} from '@/features/user/data/errors/userErrors';
import { supabase } from '@/lib/supabase';
import { getUserId } from '@/lib/user';
import 'server-only';

export async function createSubscription(followingId: string) {
  const followerId = await getUserId();
  if (!followerId) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }

  if (followerId === followingId) {
    throw new ValidationError('자기 자신을 구독할 수 없습니다');
  }

  const { error } = await supabase
    .from('subscriptions')
    .insert({ follower_id: followerId, following_id: followingId });

  if (error) {
    if (error.code === '23505') {
      throw new ValidationError('이미 구독한 사용자입니다');
    }
    if (error.code === '23503') {
      throw new ValidationError('존재하지 않는 사용자입니다');
    }
    throw new Error(error.message);
  }
}
