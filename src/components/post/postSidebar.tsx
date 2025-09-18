'use client';

import TooltipItem from '@/components/tooltipItem';
import { PostItemProps } from '@/features/post/ui/postItemProps';
import useIsMobile from '@/hooks/useIsMobile';
import useMediaQuery from '@/hooks/useMediaQuery';
import { setIsVisible } from '@/lib/redux/postSidebarSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { ChevronLeft, FileUser, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

function FooterItem() {
  const mail = process.env.NEXT_PUBLIC_CONTACT_MAIL;
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;
  const isMobile = useIsMobile();
  const dispatch = useDispatch<AppDispatch>();

  const handleMailIconClick = async () => {
    if (mail === undefined) return;
    try {
      await navigator.clipboard.writeText(mail);
      toast.success(`${mail} 복사 완료`);
    } catch {
      toast.error('복사 실패');
    }
  };

  return (
    <div className='flex w-full min-w-0 items-center px-6 py-12 gap-4'>
      <button
        onClick={() => dispatch(setIsVisible(false))}
        className='flex xl:hidden'
      >
        <ChevronLeft className='w-10 h-10 stroke-1 text-gray-900' />
      </button>

      <div className='flex flex-1 min-w-0 justify-center'>
        <div className='flex min-w-0 gap-x-4'>
          {githubUrl && (
            <TooltipItem text='Github'>
              <a
                href={githubUrl}
                onClick={() => dispatch(setIsVisible(false))}
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 flex min-w-0 justify-center items-center rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out'
              >
                {isMobile ? (
                  <div className='flex flex-col items-center min-w-0 gap-y-1'>
                    <Image
                      width={16}
                      height={16}
                      src='/images/github.png'
                      alt='github icon'
                      className='rounded-full'
                    />
                    <div className='text-xs'>Github</div>
                  </div>
                ) : (
                  <Image
                    width={20}
                    height={20}
                    src='/images/github.png'
                    alt='github icon'
                    className='rounded-full'
                  />
                )}
              </a>
            </TooltipItem>
          )}

          {mail && (
            <TooltipItem text={mail}>
              <button
                onClick={handleMailIconClick}
                className='w-10 h-10 flex justify-center items-center cursor-pointer rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out'
              >
                {isMobile ? (
                  <div className='flex flex-col items-center min-w-0 gap-y-1'>
                    <Mail className='w-4 h-4' />
                    <div className='text-xs'>Mail</div>
                  </div>
                ) : (
                  <Mail className='w-5 h-5' />
                )}
              </button>
            </TooltipItem>
          )}

          <TooltipItem text='포트폴리오'>
            <Link
              href='/portfolio'
              onClick={() => dispatch(setIsVisible(false))}
              className='w-10 h-10 flex justify-center items-center cursor-pointer rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out'
            >
              {isMobile ? (
                <div className='flex flex-col items-center min-w-0 gap-y-1'>
                  <FileUser className='w-4 h-4' />
                  <div className='text-xs'>Portfolio</div>
                </div>
              ) : (
                <FileUser className='w-5 h-5' />
              )}
            </Link>
          </TooltipItem>
        </div>
      </div>
    </div>
  );
}

export default function PostSidebar({ posts }: { posts: PostItemProps[] }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const selectedSlug = params.slug as string | undefined;
  const selectedTag = searchParams.get('tag') ?? null;
  const dispatch = useDispatch<AppDispatch>();
  const postSidebar = useSelector((state: RootState) => state.postSidebar);
  const isLargerThanXl = useMediaQuery('(min-width: 1280px)');

  const sidebarRef = useRef<HTMLDivElement>(null);
  const start = useRef<[number, number] | null>(null);
  const scrollDirection = useRef<'horizontal' | 'vertical' | null>(null);

  const tagCount = useMemo(() => {
    const tagMap = posts
      .flatMap(post => post.tags)
      .reduce(
        (acc, tag) => acc.set(tag, (acc.get(tag) ?? 0) + 1),
        new Map<string, number>()
      );
    return [...tagMap.entries()];
  }, [posts]);

  const postsOfTag = useMemo(() => {
    return selectedTag
      ? posts.filter(post => post.tags.includes(selectedTag))
      : null;
  }, [posts, selectedTag]);

  const isVisible = useMemo(
    () => isLargerThanXl || postSidebar.isVisible,
    [postSidebar, isLargerThanXl]
  );

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleTouchStart = (e: TouchEvent) => {
      start.current = [e.touches[0].clientX, e.touches[0].clientY];
      sidebar.style.transition = 'none';
      scrollDirection.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (start.current === null) return;

      const [currentX, currentY] = [e.touches[0].clientX, e.touches[0].clientY];

      if (!scrollDirection.current) {
        const deltaX = currentX - start.current[0];
        const deltaY = currentY - start.current[1];
        scrollDirection.current =
          Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
      }

      if (scrollDirection.current === 'horizontal') {
        e.preventDefault();
        document.body.style.overflow = 'hidden';
        const translateX = Math.min(currentX - start.current[0], 0);
        sidebar.style.transform = `translateX(${translateX}px)`;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (start.current === null) return;

      if (scrollDirection.current === 'horizontal') {
        const currentX = e.changedTouches[0].clientX;
        const translateX = Math.min(currentX - start.current[0], 0);
        const threshold = -sidebar.getBoundingClientRect().width * 0.3;

        if (translateX > threshold) {
          dispatch(setIsVisible(true));
        } else {
          dispatch(setIsVisible(false));
        }
      }

      sidebar.style.transition = '';
      sidebar.style.transform = '';
      document.body.style.overflow = '';
      start.current = null;
      scrollDirection.current = null;
    };

    sidebar.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    sidebar.addEventListener('touchmove', handleTouchMove, { passive: false });
    sidebar.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      sidebar.removeEventListener('touchstart', handleTouchStart);
      sidebar.removeEventListener('touchmove', handleTouchMove);
      sidebar.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dispatch]);

  return (
    <div
      ref={sidebarRef}
      className={clsx(
        'fixed left-0 top-0 bottom-0 w-72 transition-transform duration-300 ease-in-out',
        !isVisible && '-translate-x-full'
      )}
    >
      <div className='flex flex-col w-full min-w-0 h-dvh bg-gray-50/50 backdrop-blur-md border-r border-r-gray-50'>
        <div className='flex w-full min-w-0 px-6 py-9'>
          <Link
            onClick={() => dispatch(setIsVisible(false))}
            className='flex flex-col min-w-0 px-3 py-3'
            href='/posts'
          >
            <div className='text-2xl font-bold tracking-tight text-blue-500'>
              Haechan
            </div>
            <div className='text-xs text-gray-400 mt-1 font-light tracking-wide'>
              DEV BLOG
            </div>
          </Link>
        </div>

        <div className='flex flex-col flex-1 overflow-y-auto'>
          {tagCount.map(([tag, count]) => {
            return (
              <div key={tag}>
                <Link
                  href={
                    !selectedSlug && selectedTag === tag
                      ? '/posts'
                      : `/posts?tag=${tag}`
                  }
                  className={clsx(
                    'flex items-center w-full py-3 px-9 gap-2 hover:text-blue-500',
                    !selectedSlug && tag === selectedTag
                      ? 'bg-blue-50 font-semibold text-blue-500'
                      : 'text-gray-900'
                  )}
                >
                  <div className='flex-1 text-sm'>{tag}</div>
                  {tag !== selectedTag && (
                    <div className='flex-shrink-0 text-xs text-gray-400'>
                      {count}
                    </div>
                  )}
                </Link>
                {tag === selectedTag &&
                  postsOfTag &&
                  postsOfTag.map(post => (
                    <Link
                      key={`${tag}-${post.slug} `}
                      href={`/posts/${post.slug}${
                        selectedTag ? `?tag=${selectedTag}` : ''
                      }`}
                      onClick={() => dispatch(setIsVisible(false))}
                      className={clsx(
                        'flex w-full py-3 pl-12 pr-9 hover:text-blue-500',
                        post.slug === selectedSlug
                          ? 'bg-blue-50 font-semibold text-blue-500'
                          : 'text-gray-900'
                      )}
                    >
                      <div className='text-sm'>{post.title}</div>
                    </Link>
                  ))}
              </div>
            );
          })}
        </div>

        <FooterItem />
      </div>
    </div>
  );
}
