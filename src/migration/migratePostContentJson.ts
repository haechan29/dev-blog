import type { JSONContent } from '@tiptap/core';

import { htmlToTiptapJson } from '@/migration/htmlToTiptapJson';
import { markdownToHtml } from '@/migration/markdownToHtml';
import {
  fetchPostForMigration,
  updatePostContentJsonForMigration,
} from '@/migration/postQueries';

export async function migratePostContentToJson(
  postId: string
): Promise<JSONContent | null> {
  const post = await fetchPostForMigration(postId);

  if (!post.content) {
    throw new Error(`게시물(${postId})에 content 가 없습니다.`);
  }

  const html = await markdownToHtml(post.content);

  const contentJson = htmlToTiptapJson(html);

  await updatePostContentJsonForMigration({ postId, contentJson });

  return contentJson;
}
