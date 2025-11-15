'use client';

import { canTouch } from '@/lib/browser';
import { createRipple } from '@/lib/dom';
import {
  setRequestedBgm,
  toggleIsVideoVisible,
} from '@/lib/redux/bgmControllerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { Loader2, Maximize, Minimize, Music, Pause, Play } from 'lucide-react';
import { useId, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Bgm({
  'data-youtube-url': youtubeUrl,
  'data-start-time': startTime,
  'data-start-offset': startOffset,
  'data-end-offset': endOffset,
}: {
  'data-youtube-url': string;
  'data-start-time': string;
  'data-start-offset': string;
  'data-end-offset': string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const containerId = useId();
  const {
    isPlaying,
    isError,
    isWaiting,
    isReady,
    currentVideoId,
    isVideoVisible,
  } = useSelector((state: RootState) => state.bgmController);
  const { videoId, start } = useMemo(() => {
    return parseYouTubeUrl(youtubeUrl, startTime);
  }, [startTime, youtubeUrl]);

  return (
    <div data-start-offset={startOffset} data-end-offset={endOffset}>
      {isError && currentVideoId === videoId && (
        <div className='flex flex-col w-fit justify-center p-4 gap-2 rounded-xl bg-gray-200 text-gray-700 m-4'>
          <div>{`유효하지 않은 유튜브 링크입니다`}</div>
          <div className='text-sm'>{`(${youtubeUrl})`}</div>
        </div>
      )}

      <div className='flex flex-col gap-4'>
        <div
          data-bgm-player
          className={clsx(
            'flex w-fit gap-2 p-2 rounded-lg bg-gray-100 items-center',
            isError && currentVideoId === videoId && 'hidden'
          )}
        >
          <div className='p-2 w-fit h-fit bg-white rounded-md'>
            <Music className='w-4 h-4' />
          </div>
          <div className='flex items-center gap-1'>
            <div className='flex items-center justify-center relative'>
              <button
                className='p-2 w-fit h-fit cursor-pointer hover:bg-gray-200 rounded-md'
                onClick={e => {
                  if (canTouch) createRipple(e);
                  dispatch(setRequestedBgm({ videoId, start, containerId }));
                }}
                aria-label={
                  isPlaying && currentVideoId === videoId
                    ? 'bgm 일시중지'
                    : 'bgm 재생'
                }
              >
                {isPlaying && currentVideoId === videoId ? (
                  <Pause className='w-4 h-4 stroke-gray-900 fill-white' />
                ) : (
                  <Play className='w-4 h-4 stroke-gray-900 fill-white' />
                )}
              </button>

              {isWaiting && currentVideoId === videoId && (
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
                isVideoVisible && currentVideoId === videoId
                  ? '영상 감추기'
                  : '영상 보기'
              }
              aria-hidden={!(isReady && currentVideoId === videoId)}
              onClick={e => {
                if (canTouch) createRipple(e);
                dispatch(toggleIsVideoVisible());
              }}
              className={clsx(
                'p-2 w-fit h-fit cursor-pointer hover:bg-gray-200 rounded-md',
                !(isReady && currentVideoId === videoId) && 'hidden'
              )}
            >
              {isVideoVisible && currentVideoId === videoId ? (
                <Minimize className='w-4 h-4 hover:animate-pop hover:[--scale:0.8]' />
              ) : (
                <Maximize className='w-4 h-4 hover:animate-pop' />
              )}
            </button>
          </div>
        </div>

        <div
          data-bgm-container-id={containerId}
          className={clsx(!isVideoVisible && 'hidden')}
        />
      </div>
    </div>
  );
}

function parseYouTubeUrl(url: string, startTime: string) {
  const urlObj = new URL(url);
  let videoId = null;
  let start = null;

  if (urlObj.hostname.includes('youtube.com')) {
    videoId = urlObj.searchParams.get('v');
  } else if (urlObj.hostname === 'youtu.be') {
    videoId = urlObj.pathname.slice(1);
  }

  const t = urlObj.searchParams.get('t');
  start = parseTimeToSeconds(startTime) ?? parseTimeToSeconds(t);
  return { videoId, start };
}

function parseTimeToSeconds(timeStr: string | null): number | null {
  if (timeStr === null) return null;
  try {
    let totalSeconds = 0;

    const hours = timeStr.match(/(\d+)h/);
    const minutes = timeStr.match(/(\d+)m/);
    const seconds = timeStr.match(/(\d+)s/);

    if (hours) totalSeconds += parseInt(hours[1]) * 3600;
    if (minutes) totalSeconds += parseInt(minutes[1]) * 60;
    if (seconds) totalSeconds += parseInt(seconds[1]);

    if (!hours && !minutes && !seconds) {
      totalSeconds = parseInt(timeStr) || 0;
    }

    return totalSeconds;
  } catch {
    return null;
  }
}
