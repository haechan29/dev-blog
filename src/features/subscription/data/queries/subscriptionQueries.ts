import { UnauthorizedError, ValidationError } from '@/errors/errors';
import { FollowUserEntity } from '@/features/subscription/data/entities/followUserEntities';
import { supabase } from '@/lib/supabase';
import { getUserId } from '@/lib/user';
import 'server-only';

export async function getSubscriptionInfo({
  followerUserId,
  followingUserId,
}: {
  followerUserId?: string;
  followingUserId: string;
}) {
  if (!followerUserId) {
    return { isSubscribed: false };
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('follower_id')
    .eq('follower_id', followerUserId)
    .eq('following_id', followingUserId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return { isSubscribed: data !== null };
}

export async function getFollowers(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('follower:users!follower_id(id, nickname, profile_image_url)')
    .eq('following_id', userId)
    .is('follower.deleted_at', null);

  if (error) {
    throw new Error(error.message);
  }

  return data.map(row => row.follower) as unknown as FollowUserEntity[];
}

export async function getFollowing(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('following:users!following_id(id, nickname, profile_image_url)')
    .eq('follower_id', userId)
    .is('following.deleted_at', null);

  if (error) {
    throw new Error(error.message);
  }

  return data.map(row => row.following) as unknown as FollowUserEntity[];
}

export async function getFollowingIds(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('following_id')
    .eq('follower_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data.map(s => s.following_id);
}

export async function createSubscription(
  followingId: string,
  followerId: string
) {
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

  const { data: deleted, error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .select('follower_id');

  if (error) {
    throw new Error(error.message);
  }

  return deleted;
}
