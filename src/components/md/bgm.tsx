'use client';

import { canTouch } from '@/lib/browser';
import { createRipple } from '@/lib/dom';
import { setRequestedBgm } from '@/lib/redux/bgmControllerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { AlertCircle, Loader2, Music } from 'lucide-react';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const VIEWER_BGM_CONTAINER_ID = 'viewer-bgm-container-id';

export function Bgm({
  src,
  'data-status': status,
  'data-start-offset': startOffset,
  'data-end-offset': endOffset,
  'data-mode': mode,
}: {
  src: string;
  'data-status'?: 'loading' | 'failed';
  'data-start-offset': string;
  'data-end-offset': string;
  'data-mode': 'preview' | 'reader' | 'viewer';
}) {
  const containerId = useMemo(() => {
    return mode === 'viewer'
      ? VIEWER_BGM_CONTAINER_ID
      : `${startOffset}-${src}`;
  }, [mode, startOffset, src]);

  return (
    <div
      data-bgm
      data-src={src}
      data-status={status}
      data-start-offset={startOffset}
      data-end-offset={endOffset}
    >
      <BgmButton src={src} status={status} containerId={containerId} />
    </div>
  );
}

export function BgmButton({
  src,
  status,
  containerId,
}: {
  src: string;
  status?: 'loading' | 'failed';
  containerId: string;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const {
    isPlaying: isControllerPlaying,
    isError: isControllerError,
    isWaiting: isConrollerWaiting,
    currentContainerId,
  } = useSelector((state: RootState) => state.bgmController);

  const isCurrentContainer = currentContainerId === containerId;
  const isPlaying = isControllerPlaying && isCurrentContainer;
  const isWaiting =
    status === 'loading' || (isConrollerWaiting && isCurrentContainer);
  const isError =
    status === 'failed' || (isControllerError && isCurrentContainer);
  const isDisabled = isWaiting || isError;

  return (
    <div className='flex flex-col items-end'>
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
            if (canTouch) createRipple(e);
            dispatch(setRequestedBgm({ src, containerId }));
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
              'w-4 h-4 ',
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
    </div>
  );
}
