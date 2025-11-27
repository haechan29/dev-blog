export interface Post {
  id: string;
  title: string;
  tags: string[];
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  guest_id: string | null;
  author_name: string;
  is_deleted: boolean;
  is_guest: boolean;
}
