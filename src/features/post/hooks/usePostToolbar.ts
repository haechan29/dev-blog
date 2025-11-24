'use client';

import { createProps } from '@/features/post/ui/postToolbarProps';
import { RootState } from '@/lib/redux/store';
import { useSelector } from 'react-redux';

export default function usePostToolbar() {
  const postToolbar = useSelector((state: RootState) => state.postToolbar);
  const postReader = useSelector((state: RootState) => state.postReader);
  return createProps({ postToolbar, postReader });
}
