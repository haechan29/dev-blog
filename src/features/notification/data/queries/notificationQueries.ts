import { NotificationEntity } from '@/features/notification/data/entities/notificationEntities';
import { supabase } from '@/lib/supabase';
import 'server-only';

const NOTIFICATION_SELECT_FIELDS = `
  id, 
  user_id, 
  type, 
  is_read, 
  post_id, 
  comment_id, 
  comment_count, 
  representative_user_id, 
  representative_comment_id, 
  milestone_value, 
  created_at, 
  updated_at,
  post:post_id ( title ),
  representative_user:representative_user_id ( nickname, profile_image_url ),
  representative_comment:comments!representative_comment_id ( content ),
  comment:comment_id ( content ),
`;

function applyQuotedLiteral(value: string) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '""')}"`;
}

export async function fetchNotifications({
  userId,
  limit,
  cursorUpdatedAt,
  cursorId,
}: {
  userId: string;
  limit: number;
  cursorUpdatedAt?: string;
  cursorId?: string;
}) {
  let query = supabase
    .from('notifications')
    .select(NOTIFICATION_SELECT_FIELDS)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit);

  if (cursorUpdatedAt != null && cursorId != null) {
    const t = applyQuotedLiteral(cursorUpdatedAt);
    const id = applyQuotedLiteral(cursorId);
    query = query.or(`updated_at.lt.${t},and(updated_at.eq.${t},id.lt.${id})`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as NotificationEntity[];
}

export async function upsertUnreadCommentNotification({
  postId,
  authorId,
  commentUserId,
  representativeCommentId,
}: {
  postId: string;
  authorId: string;
  commentUserId: string;
  representativeCommentId: number;
}) {
  if (authorId === commentUserId) {
    return;
  }

  const { data: existing, error: selectError } = await supabase
    .from('notifications')
    .select('id, comment_count')
    .eq('user_id', authorId)
    .eq('type', 'comment')
    .eq('post_id', postId)
    .eq('is_read', false)
    .maybeSingle();

  if (selectError) {
    throw new Error(selectError.message);
  }

  const now = new Date().toISOString();

  if (existing) {
    const nextCount = (existing.comment_count ?? 0) + 1;
    const { error: updateError } = await supabase
      .from('notifications')
      .update({
        comment_count: nextCount,
        updated_at: now,
      })
      .eq('id', existing.id);

    if (updateError) {
      throw new Error(updateError.message);
    }
  } else {
    const { error: insertError } = await supabase.from('notifications').insert({
      user_id: authorId,
      type: 'comment',
      is_read: false,
      post_id: postId,
      comment_id: null,
      comment_count: 1,
      representative_user_id: commentUserId,
      representative_comment_id: representativeCommentId,
      milestone_value: null,
    });

    if (insertError) {
      throw new Error(insertError.message);
    }
  }
}

export async function insertPostViewMilestoneNotification({
  postId,
  authorId,
  milestoneValue,
}: {
  postId: string;
  authorId: string;
  milestoneValue: number;
}) {
  const { error } = await supabase.from('notifications').insert({
    user_id: authorId,
    type: 'post_view_milestone',
    is_read: false,
    post_id: postId,
    comment_id: null,
    comment_count: null,
    representative_user_id: null,
    representative_comment_id: null,
    milestone_value: milestoneValue,
  });

  if (error && error.code !== '23505') {
    throw new Error(error.message);
  }
}

export async function insertPostLikeMilestoneNotification({
  postId,
  authorId,
  milestoneValue,
}: {
  postId: string;
  authorId: string;
  milestoneValue: number;
}) {
  const { error } = await supabase.from('notifications').insert({
    user_id: authorId,
    type: 'post_like_milestone',
    is_read: false,
    post_id: postId,
    comment_id: null,
    comment_count: null,
    representative_user_id: null,
    representative_comment_id: null,
    milestone_value: milestoneValue,
  });

  if (error && error.code !== '23505') {
    throw new Error(error.message);
  }
}

export async function insertCommentLikeMilestoneNotification({
  commentUserId,
  commentId,
  milestoneValue,
}: {
  commentUserId: string;
  commentId: number;
  milestoneValue: number;
}) {
  const { error } = await supabase.from('notifications').insert({
    user_id: commentUserId,
    type: 'comment_like_milestone',
    is_read: false,
    post_id: null,
    comment_id: commentId,
    comment_count: null,
    representative_user_id: null,
    representative_comment_id: null,
    milestone_value: milestoneValue,
  });

  if (error && error.code !== '23505') {
    throw new Error(error.message);
  }
}
