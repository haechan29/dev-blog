import { ValidationError } from '@/errors/errors';
import * as PostStatQueries from '@/features/postStat/data/queries/postStatQueries';
import 'server-only';

export async function incrementPostStatViewWithReadTime(
  postId: string,
  readDuration: number
) {
  const postStat = await PostStatQueries.fetchPostStatByPostId(postId);

  if (!postStat) {
    throw new ValidationError('게시글 통계를 찾을 수 없습니다');
  }

  const { view_count: prevViewCount, avg_read_time: prevAvgReadTime } =
    postStat;

  const newViewCount = prevViewCount + 1;
  const newAvgReadTime =
    (prevAvgReadTime * prevViewCount + readDuration) / newViewCount;

  await PostStatQueries.updatePostStat({
    postId,
    viewCount: newViewCount,
    avgReadTime: newAvgReadTime,
  });
}

export async function incrementPostStatLikeCount(postId: string) {
  const postStat = await PostStatQueries.fetchPostStatByPostId(postId);

  if (!postStat) {
    throw new ValidationError('게시글 통계를 찾을 수 없습니다');
  }

  const { like_count: prevLikeCount } = postStat;
  const newLikeCount = prevLikeCount + 1;

  await PostStatQueries.updatePostStat({ postId, likeCount: newLikeCount });
}

export async function decrementPostStatLikeCount(postId: string) {
  const postStat = await PostStatQueries.fetchPostStatByPostId(postId);

  if (!postStat) {
    throw new ValidationError('게시글 통계를 찾을 수 없습니다');
  }

  const { like_count: prevLikeCount } = postStat;
  const newLikeCount = Math.max(0, prevLikeCount - 1);

  await PostStatQueries.updatePostStat({ postId, likeCount: newLikeCount });
}

export async function incrementPostStatCommentCount(postId: string) {
  const postStat = await PostStatQueries.fetchPostStatByPostId(postId);

  if (!postStat) {
    throw new ValidationError('게시글 통계를 찾을 수 없습니다');
  }

  const { comment_count: prevCommentCount } = postStat;
  const newCommentCount = prevCommentCount + 1;

  await PostStatQueries.updatePostStat({ postId, commentCount: newCommentCount });
}

export async function decrementPostStatCommentCount(postId: string) {
  const postStat = await PostStatQueries.fetchPostStatByPostId(postId);

  if (!postStat) {
    throw new ValidationError('게시글 통계를 찾을 수 없습니다');
  }

  const { comment_count: prevCommentCount } = postStat;
  const newCommentCount = Math.max(0, prevCommentCount - 1);

  await PostStatQueries.updatePostStat({ postId, commentCount: newCommentCount });
}
