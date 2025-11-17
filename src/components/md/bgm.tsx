'use client';

import { parseYouTubeUrl } from '@/features/post/domain/lib/bgm';
import useDebounce from '@/hooks/useDebounce';
import { canTouch } from '@/lib/browser';
import { createRipple } from '@/lib/dom';
import {
  hideMenu,
  setRequestedBgm,
  toggleIsMenuVisible,
  toggleIsVideoVisible,
} from '@/lib/redux/bgmControllerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { Loader2, Maximize, Minimize, Music, Pause, Play } from 'lucide-react';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const VIEWER_BGM_CONTAINER_ID = 'viewer-bgm-container-id';

export function Bgm({
  'data-youtube-url': youtubeUrl,
  'data-start-time': startTime,
  'data-start-offset': startOffset,
  'data-end-offset': endOffset,
  'data-mode': mode,
}: {
  'data-youtube-url': string;
  'data-start-time': string;
  'data-start-offset': string;
  'data-end-offset': string;
  'data-mode': 'preview' | 'reader' | 'viewer';
}) {
  const { videoId, start } = useMemo(() => {
    return parseYouTubeUrl(youtubeUrl, startTime);
  }, [startTime, youtubeUrl]);

  const containerId = useMemo(() => {
    return mode === 'viewer'
      ? VIEWER_BGM_CONTAINER_ID
      : `${startOffset}-${youtubeUrl}`;
  }, [mode, startOffset, youtubeUrl]);

  return (
    <div
      data-bgm
      data-youtube-url={youtubeUrl}
      data-start-time={startTime}
      data-start-offset={startOffset}
      data-end-offset={endOffset}
    >
      <BgmInner videoId={videoId} start={start} containerId={containerId} />
    </div>
  );
}

export function BgmInner({
  videoId,
  start,
  containerId,
}: {
  videoId: string | null;
  start: number;
  containerId: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const debounce = useDebounce();

  const {
    isPlaying,
    isError,
    isWaiting,
    isReady,
    isMenuVisible,
    isVideoVisible,
    currentContainerId,
  } = useSelector((state: RootState) => state.bgmController);

  return (
    <>
      {isError && currentContainerId === containerId && (
        <div className='w-fit justify-center p-4 rounded-xl bg-gray-200 text-gray-700 m-4'>
          {`유효하지 않은 유튜브 링크입니다`}
        </div>
      )}

      <div className='flex flex-col items-end'>
        <div
          data-bgm-player
          className={clsx(
            'w-fit flex flex-row-reverse gap-2 p-2 rounded-lg bg-gray-100 items-center',
            isError && currentContainerId === containerId && 'hidden'
          )}
        >
          <button
            onClick={e => {
              if (canTouch) createRipple(e);
              dispatch(toggleIsMenuVisible());
              debounce(() => dispatch(hideMenu()), 5000);
            }}
            className='p-2 w-fit h-fit bg-white rounded-md cursor-pointer group'
            aria-label={isMenuVisible ? '메뉴 닫기' : '메뉴 열기'}
          >
            <Music
              className={clsx(
                'w-4 h-4 group-hover:text-gray-400',
                isPlaying &&
                  currentContainerId === containerId &&
                  'animate-scale-pulse'
              )}
            />
          </button>

          {isMenuVisible && (
            <div className='flex flex-row-reverse items-center gap-1'>
              <div className='flex items-center justify-center relative'>
                <button
                  className='p-2 w-fit h-fit cursor-pointer hover:bg-gray-200 rounded-md'
                  onClick={e => {
                    if (canTouch) createRipple(e);
                    dispatch(setRequestedBgm({ videoId, start, containerId }));
                  }}
                  aria-label={
                    isPlaying && currentContainerId === containerId
                      ? 'bgm 일시중지'
                      : 'bgm 재생'
                  }
                >
                  {isPlaying && currentContainerId === containerId ? (
                    <Pause className='w-4 h-4 stroke-gray-900 fill-white' />
                  ) : (
                    <Play className='w-4 h-4 stroke-gray-900 fill-white' />
                  )}
                </button>

                {isWaiting && currentContainerId === containerId && (
                  <div className='w-8 h-8 absolute inset-0 m-auto z-50 bg-gray-100/50 pointer-events-none'>
                    <Loader2
                      strokeWidth={2}
                      className='w-8 h-8 animate-spin stroke-gray-400'
                    />
                  </div>
                )}
              </div>

              <button
                aria-label={
                  isVideoVisible && currentContainerId === containerId
                    ? '영상 감추기'
                    : '영상 보기'
                }
                aria-hidden={!(isReady && currentContainerId === containerId)}
                onClick={e => {
                  if (canTouch) createRipple(e);
                  dispatch(toggleIsVideoVisible());
                }}
                className={clsx(
                  'p-2 w-fit h-fit cursor-pointer hover:bg-gray-200 rounded-md',
                  !(isReady && currentContainerId === containerId) && 'hidden'
                )}
              >
                {isVideoVisible && currentContainerId === containerId ? (
                  <Minimize className='w-4 h-4 hover:animate-pop hover:[--scale:0.8]' />
                ) : (
                  <Maximize className='w-4 h-4 hover:animate-pop' />
                )}
              </button>
            </div>
          )}
        </div>

        <div
          className={clsx(
            'relative',
            !(isMenuVisible && isVideoVisible) && 'hidden'
          )}
        >
          <div className='absolute z-50 top-4 right-0'>
            <div data-bgm-container-id={containerId} />
          </div>
        </div>
      </div>
    </>
  );
}
