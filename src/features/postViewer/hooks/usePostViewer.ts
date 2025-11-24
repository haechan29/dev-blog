'use client';

import PostViewerProps, {
  createProps,
} from '@/features/postViewer/ui/postViewerProps';
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
