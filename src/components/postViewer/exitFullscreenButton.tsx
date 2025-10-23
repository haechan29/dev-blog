import Tooltip from '@/components/tooltip';
import { setIsViewerMode } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { Minimize } from 'lucide-react';
import { useDispatch } from 'react-redux';

export default function ExitFullscreenButton() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Tooltip text='전체화면 해제'>
      <button
        onClick={() => dispatch(setIsViewerMode(false))}
        className='flex shrink-0 p-2 cursor-pointer'
        aria-label='전체화면 끄기'
      >
        <Minimize className='w-6 h-6 text-white md:text-gray-900 stroke-1 hover:animate-pop hover:[--scale:0.8]' />
      </button>
    </Tooltip>
  );
}
