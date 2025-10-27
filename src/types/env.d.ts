declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  }
}

export type Comment = {
  id: number;
  post_id: string;
  author_name: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
};

export type PostStats = {
  id: string;
  post_id: string;
  like_count: number;
  view_count: number;
};

export type Post = {
  id: string;
  title: string;
  tags: string[];
  content: string;
  created_at: string;
  updated_at: string;
};
