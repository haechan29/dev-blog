'use client';

import Heading from '@/features/post/domain/model/heading';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useViewerToolbar from '@/features/postViewer/hooks/useViewerToolbar';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

export default function PostViewerToolbar({
  title,
  headings,
}: {
  title: string;
  headings: Heading[];
}) {
  const { areBarsVisible } = usePostViewer();
  const {
    isExpanded,
    currentHeading,
    toggleIsExpanded,
    onContentClick,
    ...handlers
  } = useViewerToolbar();

  return (
    <div
      className={clsx(
        'absolute top-0 left-0 right-0 z-50',
        'max-md:pb-[var(--gradient-padding-bottom)] max-md:from-black/70 max-md:to-transparent max-md:bg-gradient-to-b',
        'transition-opacity|discrete duration-300 ease-in-out',
        !areBarsVisible && 'opacity-0 pointer-events-none'
      )}
      style={{
        '--gradient-padding-bottom': isExpanded ? '5rem' : '2.5rem',
      }}
    >
      <div {...handlers} className='flex flex-col p-2 md:p-4 lg:p-6'>
        <Title title={title} heading={currentHeading} />

        <div className='flex w-full items-start'>
          <Content
            isExpanded={isExpanded}
            heading={currentHeading}
            headings={headings}
            onContentClick={onContentClick}
          />

          <ToggleExpandButton
            isExpanded={isExpanded}
            toggleIsExpanded={toggleIsExpanded}
          />
        </div>
      </div>
    </div>
  );
}

function Title({ title, heading }: { title: string; heading: Heading | null }) {
  return (
    heading !== null && (
      <div className='w-full truncate hidden md:block md:text-sm lg:text-base text-gray-400 px-2'>
        {title}
      </div>
    )
  );
}

function Content({
  isExpanded,
  heading,
  headings,
  onContentClick,
}: {
  isExpanded: boolean;
  heading: Heading | null;
  headings: Heading[];
  onContentClick: (heading: Heading) => void;
}) {
  return (
    <div className='flex flex-1 min-w-0 px-2 max-h-40 md:max-h-60 lg:max-h-80 overflow-y-auto scrollbar-hide'>
      <div className='flex flex-col w-full'>
        {headings.map(item => (
          <button
            key={item.id}
            onClick={() => onContentClick(item)}
            className={clsx(
              'w-full text-base md:text-lg lg:text-xl text-left text-white md:text-gray-900 transition-discrete|opacity duration-300 ease-in',
              isExpanded || heading?.id === item.id
                ? 'h-6 opacity-100'
                : 'h-0 opacity-0',
              heading?.id === item.id
                ? 'text-gray-900 font-bold'
                : 'text-gray-400',
              isExpanded && 'my-1 md:my-2',
              isExpanded && item.level === 2 && 'pl-4',
              isExpanded && item.level === 3 && 'pl-8'
            )}
          >
            {item.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleExpandButton({
  isExpanded,
  toggleIsExpanded,
}: {
  isExpanded: boolean;
  toggleIsExpanded: () => void;
}) {
  return (
    <button
      onClick={toggleIsExpanded}
      className='flex shrink-0 px-2 items-center justify-center cursor-pointer'
    >
      <ChevronDown
        className={clsx(
          'w-6 h-6 text-white md:text-gray-500 stroke-1 transition-transform duration-300 ease-in-out',
          isExpanded && '-rotate-180'
        )}
      />
    </button>
  );
}
