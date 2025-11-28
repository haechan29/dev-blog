export interface PostEntity {
  id: string;
  title: string;
  tags: string[];
  content: string;
  created_at: string;
  updated_at: string | null;
  user_id: string | null;
  guest_id: string | null;
  users?: { nickname: string; deleted_at: string | null } | null;
  password_hash?: string | null;
}
