'use client';

import Post from '@/features/post/domain/model/post';
import { PostProps } from '@/features/post/ui/postProps';
import { setIsVisible } from '@/lib/redux/postSidebarSlice';
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
  const currentSlug = params.slug as string | undefined;

  const isTagSelected = useMemo(() => currentTag === tag, [currentTag, tag]);

  const categoryUrl = useMemo(() => {
    let categoryUrl = '/posts';
    if (currentSlug) categoryUrl += `/${currentSlug}`;
    if (currentSlug || !isTagSelected) categoryUrl += `?tag=${tag}`;
    return categoryUrl;
  }, [currentSlug, isTagSelected, tag]);

  return (
    <Link
      href={categoryUrl}
      className={clsx(
        'flex items-center w-full py-3 px-9 gap-2 hover:text-blue-500',
        !currentSlug && isTagSelected
          ? 'bg-blue-50 font-semibold text-blue-500'
          : 'text-gray-900'
      )}
    >
      <div className='flex-1 text-sm'>{tag}</div>
      {!isTagSelected && (
        <div className='flex-shrink-0 text-xs text-gray-400'>{count}</div>
      )}
    </Link>
  );
}

function NavPostList({ tag, posts }: { tag: string; posts: PostProps[] }) {
  const dispatch = useDispatch<AppDispatch>();

  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag') ?? null;

  const params = useParams();
  const currentSlug = params.slug as string | undefined;

  const postsOfTag = useMemo(() => {
    return currentTag
      ? posts.filter(post => post.tags.includes(currentTag))
      : [];
  }, [posts, currentTag]);

  const isTagSelected = useMemo(() => currentTag === tag, [currentTag, tag]);

  return (
    isTagSelected &&
    postsOfTag.map(post => {
      const postUrl = getPostUrl(currentTag, post);
      const isSlugSelected = post.slug === currentSlug;

      return (
        <Link
          key={`${tag}-${post.slug} `}
          href={postUrl}
          onClick={() => dispatch(setIsVisible(false))}
          className={clsx(
            'flex w-full py-3 pl-12 pr-9 hover:text-blue-500',
            isSlugSelected
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
  const tagMap = posts
    .flatMap(post => post.tags)
    .reduce(
      (acc, tag) => acc.set(tag, (acc.get(tag) ?? 0) + 1),
      new Map<string, number>()
    );
  return [...tagMap.entries()];
}

function getPostUrl(tag: string | null, post: Post) {
  let postUrl = `/posts/${post.slug}`;
  if (tag) postUrl += `?tag=${tag}`;
  return postUrl;
}
