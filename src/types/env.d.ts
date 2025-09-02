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
};
