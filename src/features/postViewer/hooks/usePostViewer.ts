'use client';

import { PostViewer } from '@/features/postViewer/domain/model/postViewer';
import PostViewerProps from '@/features/postViewer/ui/postViewerProps';
import { RootState } from '@/lib/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function usePostViewer() {
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const [postViewerProps, setPostViewerProps] = useState<PostViewerProps>(
    createProps({ postViewer })
  );

  useEffect(() => {
    const postViewerProps = createProps({ postViewer });
    setPostViewerProps(postViewerProps);
  }, [postViewer]);

  return postViewerProps;
}

function createProps({
  postViewer,
}: {
  postViewer: PostViewer;
}): PostViewerProps {
  return {
    areBarsVisible:
      postViewer.isMouseOnToolbar ||
      postViewer.isMouseOnControlBar ||
      postViewer.isMouseMoved ||
      postViewer.isToolbarExpanded ||
      postViewer.isTouched ||
      postViewer.isToolbarTouched ||
      postViewer.isControlBarTouched ||
      postViewer.isRotationFinished,
    pageNumber:
      postViewer.currentPageIndex === null
        ? null
        : postViewer.currentPageIndex + 1,
    totalPages: postViewer.pages.length + 1,
    ...(postViewer.currentPageIndex !== null && {
      page: postViewer.pages[postViewer.currentPageIndex],
    }),
    ...postViewer,
  };
}
