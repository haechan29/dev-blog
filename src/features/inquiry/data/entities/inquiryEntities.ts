export interface InquiryEntity {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  users: {
    nickname: string | null;
  } | null;
}
