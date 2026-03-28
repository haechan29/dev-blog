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
  updated_at
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
