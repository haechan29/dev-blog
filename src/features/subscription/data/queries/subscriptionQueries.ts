import {
  UnauthorizedError,
  ValidationError,
} from '@/features/user/data/errors/userErrors';
import { supabase } from '@/lib/supabase';
import { getUserId } from '@/lib/user';
import 'server-only';

export async function getSubscriptionInfo(followingId: string) {
  const followerId = await getUserId();

  let isSubscribed = false;
  if (followerId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('follower_id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    isSubscribed = data !== null;
  }

  const { count, error } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', followingId);

  if (error) {
    throw new Error(error.message);
  }

  return {
    isSubscribed,
    subscriberCount: count ?? 0,
  };
}

export async function getFollowers(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('follower:users!follower_id(id, nickname)')
    .eq('following_id', userId)
    .is('follower.deleted_at', null);

  if (error) {
    throw new Error(error.message);
  }

  return data.map(row => row.follower);
}

export async function getFollowing(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('following:users!following_id(id, nickname)')
    .eq('follower_id', userId)
    .is('following.deleted_at', null);

  if (error) {
    throw new Error(error.message);
  }

  return data.map(row => row.following);
}

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

export async function deleteSubscription(followingId: string) {
  const followerId = await getUserId();
  if (!followerId) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }

  if (followerId === followingId) {
    throw new ValidationError('자기 자신을 구독취소할 수 없습니다');
  }

  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);

  if (error) {
    throw new Error(error.message);
  }
}
