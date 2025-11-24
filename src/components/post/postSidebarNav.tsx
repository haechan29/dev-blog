'use client';

import { EMPTY_TAG_NAME } from '@/features/post/constants/tagName';
import { PostProps } from '@/features/post/ui/postProps';
import { setIsVisible } from '@/lib/redux/post/postSidebarSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

export default function PostSidebarNav({ posts }: { posts: PostProps[] }) {
  const tagCount = useMemo(() => getTagCounts(posts), [posts]);

  return (
    <div className='flex flex-col flex-1 overflow-y-auto'>
      {tagCount.map(([tag, count]) => {
        return (
          <div key={tag}>
            <NavCategory tag={tag} count={count} />
            <NavPostList tag={tag} posts={posts} />
          </div>
        );
      })}
    </div>
  );
}

function NavCategory({ tag, count }: { tag: string; count: number }) {
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag') ?? null;

  const params = useParams();
  const currentPostId = params.postId as string | undefined;

  const categoryUrl = useMemo(() => {
    let categoryUrl = '/posts';
    if (currentPostId) categoryUrl += `/${currentPostId}`;
    if (currentPostId || currentTag !== tag) categoryUrl += `?tag=${tag}`;
    return categoryUrl;
  }, [currentPostId, currentTag, tag]);

  return (
    <Link
      href={categoryUrl}
      className={clsx(
        'flex items-center w-full p-3 gap-2 rounded-sm hover:text-blue-500',
        !currentPostId && currentTag === tag
          ? 'bg-blue-50 font-semibold text-blue-500'
          : 'text-gray-900'
      )}
    >
      <div className='flex-1 text-sm'>{tag}</div>
      {currentTag !== tag && (
        <div className='shrink-0 text-xs text-gray-400'>{count}</div>
      )}
    </Link>
  );
}

function NavPostList({ tag, posts }: { tag: string; posts: PostProps[] }) {
  const dispatch = useDispatch<AppDispatch>();

  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag') ?? null;

  const params = useParams();
  const currentPostId = params.postId as string | undefined;

  const postsOfTag = useMemo(() => {
    if (!currentTag) return [];
    return posts.filter(post => {
      return post.tags.length > 0
        ? post.tags.includes(currentTag)
        : currentTag === EMPTY_TAG_NAME;
    });
  }, [posts, currentTag]);

  return (
    currentTag === tag &&
    postsOfTag.map(post => {
      const postUrl = getPostUrl(currentTag, post);
      const isCurrentPost = post.id === currentPostId;

      return (
        <Link
          key={`${tag}-${post.id} `}
          href={postUrl}
          onClick={() => dispatch(setIsVisible(false))}
          className={clsx(
            'flex w-full py-3 pl-6 pr-3 rounded-sm hover:text-blue-500',
            isCurrentPost
              ? 'bg-blue-50 font-semibold text-blue-500'
              : 'text-gray-900'
          )}
        >
          <div className='text-sm'>{post.title}</div>
        </Link>
      );
    })
  );
}

function getTagCounts(posts: PostProps[]) {
  let emptyTagCount = 0;
  const tagMap = posts.reduce((acc, post) => {
    if (post.tags.length > 0) {
      post.tags.forEach(tag => {
        acc.set(tag, (acc.get(tag) ?? 0) + 1);
      });
    } else {
      emptyTagCount++;
    }
    return acc;
  }, new Map<string, number>());
  tagMap.set(EMPTY_TAG_NAME, emptyTagCount);
  return [...tagMap.entries()];
}

function getPostUrl(tag: string | null, post: PostProps) {
  let postUrl = `/posts/${post.id}`;
  if (tag) postUrl += `?tag=${tag}`;
  return postUrl;
}
