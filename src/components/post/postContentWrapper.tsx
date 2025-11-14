'use client';

import TableOfContentsItem from '@/components/post/tableOfContentsItem';
import PostViewer from '@/components/postViewer/postViewer';
import useContentTracker from '@/features/post/hooks/useContentTracker';
import useHeadingSync from '@/features/post/hooks/useHeadingSync';
import usePostReader from '@/features/post/hooks/usePostReader';
import useScrollTracker from '@/features/post/hooks/useScrollTracker';
import { PostProps } from '@/features/post/ui/postProps';
import { ReactNode } from 'react';

export default function PostContentWrapper({
  post,
  parsed,
  raw,
}: {
  post: PostProps;
  parsed: ReactNode;
  raw: ReactNode;
}) {
  const {
    postReader: { mode, isTableVisible },
  } = usePostReader();

  useContentTracker();
  useScrollTracker();
  useHeadingSync(post);

  return (
    <>
      {isTableVisible && post.headings.length > 0 && (
        <div className='mb-10 xl:mb-0'>
          <div className='block xl:hidden text-xl xl:text-2xl font-bold text-gray-900 mt-4 mb-2 leading-tight'>
            목차
          </div>
          <TableOfContentsItem headings={post.headings} />
        </div>
      )}

      <PostViewer post={post} />
      <div className='mb-20'>{mode === 'raw' ? <>{raw}</> : <>{parsed}</>}</div>
    </>
  );
}
