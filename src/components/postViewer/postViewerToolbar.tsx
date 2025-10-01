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
  const { isExpanded, currentHeading, toggleIsExpanded, handleContentClick } =
    useViewerToolbar();

  return (
    <div
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 flex flex-col backdrop-blur-md bg-white/80 px-10 py-3',
        'transition-opacity duration-300 ease-in-out',
        !areBarsVisible && 'opacity-0'
      )}
    >
      <Title title={title} heading={currentHeading} />

      <div className='flex w-full items-start'>
        <Content
          isExpanded={isExpanded}
          heading={currentHeading}
          headings={headings}
          onContentClick={handleContentClick}
        />

        <ToggleExpandButton
          isExpanded={isExpanded}
          toggleIsExpanded={toggleIsExpanded}
        />
      </div>
    </div>
  );
}

function Title({ title, heading }: { title: string; heading: Heading | null }) {
  return (
    heading !== null && (
      <div className={clsx('w-full truncate text-gray-400')}>{title}</div>
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
    <div className='flex flex-1 min-w-0'>
      <div className='flex flex-col w-full'>
        {headings.map(item => (
          <button
            key={item.id}
            onClick={() => onContentClick(item)}
            className={clsx(
              'flex w-full text-xl transition-discrete|opacity duration-300 ease-in',
              isExpanded || heading?.id === item.id
                ? 'h-6 opacity-100'
                : 'h-0 opacity-0',
              heading?.id === item.id
                ? 'text-gray-900 font-bold'
                : 'text-gray-400',
              isExpanded && 'my-2',
              isExpanded && item.level === 2 && 'pl-4',
              isExpanded && item.level === 3 && 'pl-8'
            )}
          >
            <span className='truncate'>{item.text}</span>
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
      className='flex shrink-0 px-2 items-center justify-center'
    >
      <ChevronDown
        className={clsx(
          'w-6 h-6 text-gray-500 transition-transform duration-300 ease-in-out',
          isExpanded && '-rotate-180'
        )}
      />
    </button>
  );
}
