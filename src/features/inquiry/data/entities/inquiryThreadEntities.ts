export interface InquiryThreadEntity {
  id: string;
  user_id: string;
  status: string;
  last_message_preview: string | null;
  created_at: string;
  updated_at: string;
}
