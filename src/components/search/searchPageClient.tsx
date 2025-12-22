'use client';

import HomeSidebar from '@/components/home/homeSidebar';
import HomeToolbar from '@/components/home/homeToolbar';
import PostPreview from '@/components/post/postPreview';
import ToolbarProfileIcon from '@/components/post/toolbarProfileIcon';
import SearchAutocomplete from '@/components/search/searchAutocomplete';
import { PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import { ChevronLeft, Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const MOCK_POSTS: PostProps[] = [
  {
    id: '1',
    title: 'Next.js 15에서 달라진 점들',
    createdAt: '2024년 12월 20일',
    updatedAt: '2024년 12월 20일',
    tags: ['Next.js', 'React', '프론트엔드'],
    content: '',
    headings: [],
    plainText:
      'Next.js 15가 출시되면서 여러 변화가 있었습니다. App Router의 안정화, Turbopack 정식 지원 등...',
    userId: 'user1',
    authorName: '김개발',
    userStatus: 'ACTIVE',
    seriesId: null,
    seriesOrder: null,
    seriesTitle: null,
    likeCount: 42,
    viewCount: 1280,
  },
  {
    id: '2',
    title: 'Supabase로 블로그 검색 기능 구현하기',
    createdAt: '2024년 12월 18일',
    updatedAt: '2024년 12월 19일',
    tags: ['Supabase', 'PostgreSQL', '검색'],
    content: '',
    headings: [],
    plainText:
      'pg_trgm과 Full Text Search를 조합해서 검색 기능을 구현해봤습니다...',
    userId: 'user2',
    authorName: '박서버',
    userStatus: 'ACTIVE',
    seriesId: 'series1',
    seriesOrder: 3,
    seriesTitle: 'Supabase 완전 정복',
    likeCount: 28,
    viewCount: 856,
  },
  {
    id: '3',
    title: 'Tailwind v4 마이그레이션 후기',
    createdAt: '2024년 12월 15일',
    updatedAt: '2024년 12월 15일',
    tags: ['Tailwind', 'CSS'],
    content: '',
    headings: [],
    plainText:
      'Tailwind v4로 마이그레이션하면서 겪은 이슈들과 해결 방법을 공유합니다...',
    userId: 'user1',
    authorName: '김개발',
    userStatus: 'ACTIVE',
    seriesId: null,
    seriesOrder: null,
    seriesTitle: null,
    likeCount: 15,
    viewCount: 432,
  },
];

export default function SearchPageClient({
  isLoggedIn,
  userId,
  initialQuery,
}: {
  isLoggedIn: boolean;
  userId?: string;
  initialQuery?: string;
}) {
  const [isSearching, setIsSearching] = useState(!initialQuery);

  // const { data: posts = [], isLoading } = useQuery({
  //   queryKey: ['searchPosts', initialQuery],
  //   queryFn: () =>
  //     PostClientService.searchPosts(initialQuery!).then(posts =>
  //       posts.map(createProps)
  //     ),
  //   enabled: !!initialQuery,
  // });

  const posts = MOCK_POSTS;
  const isLoading = false;

  // 모바일 + 검색 모드
  if (isSearching) {
    return (
      <div className='md:hidden'>
        <SearchAutocomplete
        // initialValue={initialQuery}
        // onBack={() => setIsSearching(false)}
        />
      </div>
    );
  }

  return (
    <>
      <div className='max-md:hidden'>
        <HomeToolbar isLoggedIn={isLoggedIn} />
      </div>

      <div className='md:hidden'>
        <SearchToolbarMobile
          query={initialQuery}
          onSearchClick={() => setIsSearching(true)}
          isLoggedIn={isLoggedIn}
        />
      </div>

      {userId && (
        <div className='max-xl:hidden'>
          <HomeSidebar userId={userId} />
        </div>
      )}

      <div
        className={clsx(
          'mt-(--toolbar-height) mb-8 px-6 md:px-12 xl:px-18',
          'xl:ml-(--sidebar-width)',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        {isLoading ? (
          <div className='flex justify-center py-8'>
            <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
          </div>
        ) : posts.length === 0 ? (
          <div className='py-8 text-center text-gray-500'>
            검색 결과가 없습니다
          </div>
        ) : (
          <div className='flex flex-col mt-8'>
            {posts.map((post, index) => (
              <div key={post.id} className='mb-8'>
                <PostPreview
                  isLoggedIn={isLoggedIn}
                  post={post}
                  userId={userId}
                />
                {index !== posts.length - 1 && (
                  <div className='h-px bg-gray-200' />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function SearchToolbarMobile({
  query,
  onSearchClick,
  isLoggedIn,
}: {
  query?: string;
  onSearchClick: () => void;
  isLoggedIn: boolean;
}) {
  const router = useRouter();

  return (
    <div className='fixed top-0 z-40 w-full flex items-center py-2 px-4 gap-2 bg-white/80 backdrop-blur-md'>
      <button onClick={() => router.back()} className='p-2 -my-2 -ml-4 -mr-2'>
        <ChevronLeft className='w-7 h-7 text-gray-500' />
      </button>

      <button
        onClick={onSearchClick}
        className='flex-1 flex items-center px-4 py-1 bg-gray-100 rounded-full mr-1'
      >
        <span className='flex-1 text-left truncate text-gray-500'>
          {query || '검색'}
        </span>
        <Search className='w-5 h-5 shrink-0' />
      </button>

      <ToolbarProfileIcon isLoggedIn={isLoggedIn} />
    </div>
  );
}
