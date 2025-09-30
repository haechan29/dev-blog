'use client';

import { createProps } from '@/features/post/ui/postToolbarProps';
import { RootState } from '@/lib/redux/store';
import { useSelector } from 'react-redux';

export default function usePostToolbar() {
  const selectedHeading = useSelector(
    (state: RootState) => state.heading.selectedHeading
  );
  const postToolbar = useSelector((state: RootState) => state.postToolbar);

  return createProps({ postToolbar, selectedHeading });
}
