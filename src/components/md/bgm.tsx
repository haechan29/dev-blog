'use client';

import useYoutubePlayer from '@/hooks/useYoutubePlayer';
import { canTouch } from '@/lib/browser';
import { createRipple } from '@/lib/dom';
import clsx from 'clsx';
import { Loader2, Music, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface YoutubePlayerData {
  videoId: string | null;
  start: number | null;
}

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
  const [playerData, setPlayerData] = useState<YoutubePlayerData>({
    videoId: null,
    start: null,
  });
  const { isPlaying, isError, isWaiting, togglePlay } = useYoutubePlayer({
    ...playerData,
  });

  useEffect(() => {
    const { videoId, timeFromUrl } = parseYouTubeUrl(youtubeUrl);
    const finalStartTime =
      startTime != null ? parseTimeToSeconds(startTime) : timeFromUrl;
    setPlayerData({
      videoId,
      start: finalStartTime,
    });
  }, [startTime, youtubeUrl]);

  return (
    <div data-start-offset={startOffset} data-end-offset={endOffset}>
      {isError && (
        <div className='flex flex-col w-fit justify-center p-4 gap-2 rounded-xl bg-gray-200 text-gray-700 m-4'>
          <div>{`유효하지 않은 유튜브 링크입니다`}</div>
          <div className='text-sm'>{`(${youtubeUrl})`}</div>
        </div>
      )}

      <div
        data-bgm-player
        data-bgm-video-id={playerData.videoId ?? ''}
        className='hidden'
      />

      <div
        className={clsx(
          'flex w-fit gap-2 p-2 rounded-lg bg-gray-100 items-center',
          isError && 'hidden'
        )}
      >
        <div className='p-2 w-fit h-fit bg-white rounded-md'>
          <Music className='w-4 h-4' />
        </div>
        <div className='flex items-center justify-center relative'>
          <button
            className='p-2 mx-1 w-fit h-fit cursor-pointer hover:bg-gray-200 rounded-md'
            onClick={e => {
              if (canTouch) createRipple(e);
              togglePlay();
            }}
            aria-label={isPlaying ? 'bgm 일시중지' : 'bgm 재생'}
          >
            {isPlaying ? (
              <Pause className='w-4 h-4 stroke-gray-900 fill-white' />
            ) : (
              <Play className='w-4 h-4 hover:stroke-2 stroke-gray-900 fill-white' />
            )}
          </button>

          {isWaiting && (
            <div className='w-8 h-8 absolute inset-0 m-auto z-50 bg-gray-100/50 pointer-events-none'>
              <Loader2
                strokeWidth={2}
                className='w-8 h-8 animate-spin stroke-gray-400'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function parseYouTubeUrl(url: string) {
  try {
    const urlObj = new URL(url);
    let videoId = null;
    let timeFromUrl = null;

    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v');
    } else if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    }

    const t = urlObj.searchParams.get('t');
    if (t) {
      timeFromUrl = parseTimeToSeconds(t);
    }

    return { videoId, timeFromUrl };
  } catch {
    return { videoId: null, timeFromUrl: null };
  }
}

function parseTimeToSeconds(timeStr: string): number {
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
}
