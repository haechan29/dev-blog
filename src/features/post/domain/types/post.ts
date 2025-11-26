export interface Post {
  id: string;
  author_name: string;
  title: string;
  tags: string[];
  content: string;
  created_at: string;
  updated_at: string;
  author_id?: string;
}
