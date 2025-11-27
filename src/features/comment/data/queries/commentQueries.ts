import { PostNotFoundError } from '@/features/post/data/errors/postErrors';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function getCommentsFromDB(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select(
      'id, post_id, author_name, content, created_at, updated_at, like_count'
    )
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new PostNotFoundError(postId, '게시물을 찾을 수 없습니다');
  }

  return data;
}
