import { PostNotFoundError } from '@/features/post/data/errors/postNotFoundError';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function getPostsFromDB() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getPostFromDB(postId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new PostNotFoundError(postId);
  }

  return data;
}

  }
}
