'use client';

import { setIsVisible } from '@/lib/redux/postSidebarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { Menu } from 'lucide-react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function SidebarButton() {
  const dispatch = useDispatch<AppDispatch>();
  const onClick = useCallback(() => dispatch(setIsVisible(true)), [dispatch]);

  return (
    <button
      onClick={onClick}
      className='flex shrink-0 p-2 items-center justify-center'
    >
      <Menu className='w-6 h-6 text-gray-500' />
    </button>
  );
}
