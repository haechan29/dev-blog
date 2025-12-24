import { toFlatDto } from '@/features/post/data/mapper/postMapper';
import * as PostQueries from '@/features/post/data/queries/postQueries';

export async function searchPosts(
  query: string,
  limit: number,
  cursorScore?: number,
  cursorId?: string
) {
  const fetchedPosts = await PostQueries.searchPosts(
    query,
    limit + 1,
    cursorScore,
    cursorId
  );

  const isLastPage = fetchedPosts.length <= limit;
  const posts = fetchedPosts.slice(0, limit);
  const lastPost = posts.at(-1);

  const nextCursor =
    isLastPage || !lastPost
      ? null
      : {
          score: lastPost.relevance_score,
          id: lastPost.id,
        };

  return {
    posts: posts.map(toFlatDto),
    nextCursor,
  };
}
