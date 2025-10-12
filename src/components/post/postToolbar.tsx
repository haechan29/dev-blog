'use client';

import Heading from '@/features/post/domain/model/heading';
import usePostToolbar from '@/features/post/hooks/usePostToolbar';
import usePostToolbarHandler from '@/features/post/hooks/usePostToolbarHandler';
import { PostToolbarProps } from '@/features/post/ui/postToolbarProps';
import clsx from 'clsx';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { useMemo } from 'react';

export default function PostToolbar() {
  const postToolbar = usePostToolbar();

  const breadcrumb = useMemo(() => {
    return postToolbar.mode === 'basic' ||
      postToolbar.mode === 'collapsed' ||
      postToolbar.mode === 'expanded'
      ? postToolbar.breadcrumb
      : [];
  }, [postToolbar]);

  const { onSidebarButtonClick, onContentClick, onExpandButtonClick } =
    usePostToolbarHandler();

  return (
    <div className='block xl:hidden fixed top-0 left-0 right-0 backdrop-blur-md bg-white/80 mb-4'>
      <div className='flex flex-col w-full min-w-0 py-2'>
        <Breadcrumb breadcrumb={breadcrumb} />

        <div className='flex w-full min-w-0 items-start'>
          <SidebarButton onClick={onSidebarButtonClick} />
          <Content postToolbar={postToolbar} onClick={onContentClick} />
          <ExpandButton mode={postToolbar.mode} onClick={onExpandButtonClick} />
        </div>
      </div>
    </div>
  );
}

function Breadcrumb({ breadcrumb }: { breadcrumb: string[] }) {
  return (
    <div
      className={clsx(
        'flex overflow-y-hidden mx-10 text-xs text-gray-400 transition-discrete duration-300 ease-in-out',
        breadcrumb.length === 0 ? 'h-0' : 'h-3'
      )}
    >
      {breadcrumb.map(item => {
        return (
          <div key={item} className='flex items-center'>
            <div>{item}</div>
            <ChevronRight className='w-3 h-3' />
          </div>
        );
      })}
    </div>
  );
}

function SidebarButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className='flex shrink-0 px-2 items-center justify-center'
    >
      <Menu className='w-6 h-6 text-gray-500' />
    </button>
  );
}

function Content({
  postToolbar,
  onClick,
}: {
  postToolbar: PostToolbarProps;
  onClick: (heading: Heading) => void;
}) {
  return (
    <div className='flex flex-1 min-w-0 max-h-60 overflow-auto scrollbar-hide'>
      <div
        className={clsx(
          'flex flex-col w-full transition-opacity duration-300 ease-in-out',
          postToolbar.mode === 'empty' ? 'opacity-0' : 'opacity-100'
        )}
      >
        {((postToolbar.mode === 'minimal' && postToolbar.title !== null) ||
          postToolbar.mode === 'basic') && (
          <div className='font-semibold h-6 truncate'>{postToolbar.title}</div>
        )}
        {(postToolbar.mode === 'collapsed' ||
          postToolbar.mode === 'expanded') && (
          <div className='flex flex-col'>
            {postToolbar.headings.map(heading => (
              <button
                key={heading.id}
                onClick={() => onClick(heading)}
                className={clsx(
                  'truncate text-left transition-discrete|opacity duration-300 ease-in',
                  postToolbar.mode === 'expanded' ||
                    postToolbar.title === heading.text
                    ? 'h-6 opacity-100'
                    : 'h-0 opacity-0',
                  postToolbar.title === heading.text
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-400',
                  postToolbar.mode === 'expanded' && 'my-1'
                )}
              >
                {heading.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExpandButton({
  mode,
  onClick,
}: {
  mode: PostToolbarProps['mode'];
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className='flex shrink-0 px-2 items-center justify-center'
    >
      <ChevronDown
        className={clsx(
          'w-6 h-6 text-gray-500 transition-opacity|transform duration-300 ease-in-out',
          mode === 'collapsed' || mode === 'expanded'
            ? 'opacity-100'
            : 'opacity-0',
          mode === 'expanded' && '-rotate-180'
        )}
      />
    </button>
  );
}
