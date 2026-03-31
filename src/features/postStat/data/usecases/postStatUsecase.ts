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
