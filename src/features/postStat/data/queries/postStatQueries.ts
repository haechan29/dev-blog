import { PostStatCreationError } from '@/features/postStat/data/errors/postStatErrors';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function createPostStat(postId: string) {
  const { error } = await supabase.from('post_stats').insert({
    post_id: postId,
    view_count: 0,
    like_count: 0,
  });

  if (error) {
    throw new PostStatCreationError('게시글 통계 생성 실패', postId);
  }
}
