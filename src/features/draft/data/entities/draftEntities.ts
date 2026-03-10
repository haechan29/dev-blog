export interface DraftEntity {
  id: string;
  user_id: string;
  post_id: string | null;
  title: string;
  content_json: object | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

