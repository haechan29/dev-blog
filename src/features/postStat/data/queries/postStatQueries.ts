import { PostStatEntity } from '@/features/postStat/data/entities/postStatEntities';
import { PostStatCreationError } from '@/features/postStat/data/errors/postStatErrors';
import { supabase } from '@/lib/supabase';
import 'server-only';

const POST_STAT_SELECT = `
  post_id,
  like_count,
  view_count,
  comment_count,
  avg_read_time,
  popularity
`;

export async function fetchPostStatByPostId(postId: string) {
  const { data, error } = await supabase
    .from('post_stats')
    .select(POST_STAT_SELECT)
    .eq('post_id', postId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as PostStatEntity | null;
}

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

export async function updatePostStat({
  postId,
  likeCount,
  commentCount,
  viewCount,
  avgReadTime,
}: {
  postId: string;
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
  avgReadTime?: number;
}) {
  const { error } = await supabase
    .from('post_stats')
    .update({
      ...(likeCount !== undefined && { like_count: likeCount }),
      ...(commentCount !== undefined && { comment_count: commentCount }),
      ...(viewCount !== undefined && { view_count: viewCount }),
      ...(avgReadTime !== undefined && { avg_read_time: avgReadTime }),
    })
    .eq('post_id', postId);

  if (error) {
    throw new Error(error.message);
  }
}
