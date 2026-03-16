import type { JSONContent } from '@tiptap/core';

import type { PostEntity } from '@/features/post/data/entities/postEntities';
import { createClient } from '@supabase/supabase-js';

const POST_SELECT_FIELDS = `
  id,
  title,
  content,
  content_json,
  tags,
  created_at,
  updated_at,
  user_id,
  series_id,
  series_order,
  visibility
`;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function fetchPostForMigration(postId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT_FIELDS)
    .eq('id', postId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('게시물을 찾을 수 없습니다');
  }

  return data as unknown as PostEntity;
}

export async function fetchPostsNeedingContentJsonMigration() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, content_json')
    .is('content_json', null);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Pick<PostEntity, 'id' | 'content_json'>[];
}

export async function updatePostContentJsonForMigration({
  postId,
  contentJson,
}: {
  postId: string;
  contentJson: JSONContent;
}) {
  const { error } = await supabase
    .from('posts')
    .update({
      content_json: contentJson,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId);

  if (error) {
    throw new Error(error.message);
  }
}

