export interface Comment {
  id: number;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  user_id: string | null;
  guest_id: string | null;
  author_name: string;
  is_deleted: boolean;
  is_guest: boolean;
}
