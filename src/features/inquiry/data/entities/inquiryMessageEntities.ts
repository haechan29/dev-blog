export interface InquiryMessageEntity {
  id: string;
  thread_id: string;
  sender_type: string;
  sender_id: string;
  content: string;
  images: string[] | null;
  is_deleted: boolean;
  created_at: string;
}
