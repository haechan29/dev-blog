export type NotificationType =
  | 'comment'
  | 'post_view_milestone'
  | 'post_like_milestone'
  | 'comment_like_milestone'
  | 'subscriber_milestone';

export interface NotificationEntity {
  id: string;
  user_id: string;
  type: NotificationType;
  is_read: boolean;
  post_id: string | null;
  comment_id: number | null;
  comment_count: number | null;
  representative_user_id: string | null;
  representative_comment_id: number | null;
  milestone_value: number | null;
  created_at: string;
  updated_at: string;
}
