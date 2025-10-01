'use client';

import { createProps } from '@/features/postViewer/ui/postViewerProps';
import { RootState } from '@/lib/redux/store';
import { useSelector } from 'react-redux';

export default function usePostViewer() {
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const postPosition = useSelector((state: RootState) => state.postPosition);

  return createProps({ postViewer, postPosition });
}
