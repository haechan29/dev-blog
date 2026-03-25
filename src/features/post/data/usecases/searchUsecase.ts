import { toFlatDto } from '@/features/post/data/mapper/postMapper';
import * as PostQueries from '@/features/post/data/queries/postQueries';

const SEARCH_LIMIT = 5;

export async function searchPosts({
  query,
  cursorScore,
  cursorId,
}: {
  query: string;
  cursorScore?: number;
  cursorId?: string;
}) {
  const fetchedPosts = await PostQueries.searchPosts({
    query,
    limit: SEARCH_LIMIT + 1,
    cursorScore,
    cursorId,
  });

  const isLastPage = fetchedPosts.length <= SEARCH_LIMIT;
  const posts = fetchedPosts.slice(0, SEARCH_LIMIT);
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
