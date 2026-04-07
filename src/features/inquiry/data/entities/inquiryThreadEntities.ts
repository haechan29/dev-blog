export interface InquiryThreadEntity {
  id: string;
  user_id: string;
  status: string;
  first_message_preview: string | null;
  first_message_id: string | null;
  last_message_preview: string | null;
  last_message_id: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}
