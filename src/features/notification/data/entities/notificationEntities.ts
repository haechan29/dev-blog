import { NotificationType } from '@/features/notification/domain/types/notificationType';

export interface NotificationEntity {
  id: string;
  user_id: string;
  type: NotificationType;
  is_read: boolean;
  inquiry_thread_id: string | null;
  post_id: string | null;
  comment_id: number | null;
  comment_count: number | null;
  representative_user_id: string | null;
  representative_comment_id: number | null;
  milestone_value: number | null;
  created_at: string;
  updated_at: string;
  post: { title: string } | null;
  representative_user: {
    nickname: string | null;
    profile_image_url: string | null;
  } | null;
  representative_comment: { content: string } | null;
  comment: { content: string } | null;
  inquiry_thread: { first_message_preview: string | null } | null;
}
