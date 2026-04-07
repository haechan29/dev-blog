export interface InquiryThreadEntity {
  id: string;
  user_id: string;
  status: string;
  first_message_preview: string | null;
  first_message_id: string | null;
  last_message_preview: string | null;
  last_message_id: string | null;
  user_unread_count: number;
  admin_unread_count: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}
