'use client';

import { canTouch } from '@/lib/browser';
import { createRipple } from '@/lib/dom';
import { setRequestedBgm } from '@/lib/redux/bgmControllerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { AlertCircle, Loader2, Music } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

export default function Bgm({ node }: NodeViewProps) {
  const { id, src, status } = node.attrs;
  const dispatch = useDispatch<AppDispatch>();

  const {
    isPlaying: isControllerPlaying,
    isError: isControllerError,
    isWaiting: isControllerWaiting,
    currentContainerId,
  } = useSelector((state: RootState) => state.bgmController);

  const isCurrentContainer = currentContainerId === id;
  const isPlaying = isControllerPlaying && isCurrentContainer;
  const isWaiting =
    status === 'loading' || (isControllerWaiting && isCurrentContainer);
  const isError =
    status === 'failed' || (isControllerError && isCurrentContainer);
  const isDisabled = isWaiting || isError;

  return (
    <NodeViewWrapper className='my-4 flex justify-end w-fit ml-auto'>
      <div
        className={clsx(
          'w-fit p-2 rounded-lg transition-colors duration-300 ease-in-out',
          isError ? 'bg-red-100' : isPlaying ? 'bg-blue-100' : 'bg-gray-100'
        )}
      >
        <button
          disabled={isDisabled}
          onClick={e => {
            if (isDisabled) return;
            if (canTouch()) createRipple(e);
            dispatch(setRequestedBgm({ src, containerId: id }));
          }}
          className={clsx(
            'p-2 w-fit h-fit rounded-md bg-white relative group',
            !isDisabled && 'cursor-pointer'
          )}
          aria-label={
            isWaiting
              ? '로딩 중'
              : isError
                ? '오류'
                : isPlaying
                  ? '일시정지'
                  : '재생'
          }
        >
          <Music
            className={clsx(
              'w-4 h-4',
              isWaiting
                ? 'text-gray-400'
                : isPlaying
                  ? 'text-blue-500 group-hover:text-blue-400'
                  : 'text-gray-900 group-hover:text-gray-400',
              isError && 'invisible',
              isPlaying && 'animate-scale-pulse'
            )}
          />
          {isWaiting && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <Loader2 className='w-7 h-7 animate-spin text-gray-400' />
            </div>
          )}
          {isError && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <AlertCircle className='w-5 h-5 text-red-400' />
            </div>
          )}
        </button>
      </div>
    </NodeViewWrapper>
  );
}
