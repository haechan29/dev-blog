'use client';

import TableOfContentsItem from '@/components/post/tableOfContentsItem';
import PostViewer from '@/components/postViewer/postViewer';
import Heading from '@/features/post/domain/model/heading';
import useContentTracker from '@/features/post/hooks/useContentTracker';
import usePostReader from '@/features/post/hooks/usePostReader';
import { PostProps } from '@/features/post/ui/postProps';
import useThrottle from '@/hooks/useThrottle';
import { setCurrentHeading } from '@/lib/redux/post/postReaderSlice';
import { AppDispatch } from '@/lib/redux/store';
import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function PostContentWrapper({
  post,
  parsed,
  raw,
}: {
  post: PostProps;
  parsed: ReactNode;
  raw: ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const throttle = useThrottle();
  const {
    postReader: { mode, isTableVisible },
  } = usePostReader();

  useContentTracker();

  useEffect(() => {
    const updateHeading = () => {
      throttle(() => {
        const heading = findHeadingByScroll();
        if (heading) {
          dispatch(setCurrentHeading(heading));
        }
      }, 100);
    };

    document.addEventListener('scroll', updateHeading);
    return () => document.removeEventListener('scroll', updateHeading);
  }, [dispatch, throttle]);

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

function findHeadingByScroll() {
  const postContent = document.querySelector('[data-post-content]');
  if (!postContent) return;

  const positionMap = new Map<Heading, number>();
  const headingElements = postContent.querySelectorAll(
    'h1, h2, h3, h4, h5, h6'
  );
  (Array.from(headingElements) as HTMLElement[]).forEach(element => {
    const heading: Heading = {
      id: element.id,
      text: element.textContent || '',
      level: parseInt(element.tagName.substring(1)),
    };
    positionMap.set(heading, element.offsetTop);
  });

  const vh = window.innerHeight;
  const threshold = 0.1 * vh;

  const headingElementsInVisibleArea = [...positionMap]
    .filter(([, position]) => Math.abs(position - window.scrollY) < threshold)
    .map(([heading]) => heading);

  if (headingElementsInVisibleArea.length > 0) {
    return headingElementsInVisibleArea[0];
  }

  const allHeadingElementsAbove = [...positionMap]
    .filter(([, position]) => position < window.scrollY - threshold)
    .map(([heading]) => heading);

  if (allHeadingElementsAbove.length > 0) {
    return allHeadingElementsAbove[allHeadingElementsAbove.length - 1];
  }

  return;
}
