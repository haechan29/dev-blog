'use client';

import useYoutubePlayer from '@/hooks/useYoutubePlayer';
import { Music, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
  const bgmRef = useRef<HTMLDivElement | null>(null);
  const [playerData, setPlayerData] = useState<YoutubePlayerData>({
    videoId: null,
    start: null,
  });
  const { isReady, isPlaying, isError, togglePlay } = useYoutubePlayer({
    ...playerData,
    containerRef: bgmRef,
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

  return isError ? (
    <div
      data-start-offset={startOffset}
      data-end-offset={endOffset}
      className='flex flex-col items-center justify-center p-4 rounded-xl bg-gray-200 text-gray-700 m-4'
      aria-label='유효하지 않은 링크입니다'
    >
      {`유효하지 않은 링크입니다 (${youtubeUrl})`}
    </div>
  ) : (
    <div data-start-offset={startOffset} data-end-offset={endOffset}>
      <div ref={bgmRef} className='hidden' />
      <div className='flex w-fit gap-2 p-2 rounded-lg bg-gray-100 items-center'>
        <div className='p-2 w-fit h-fit bg-white rounded-md'>
          <Music className='w-4 h-4' />
        </div>
        <button
          className='py-2 px-3 w-fit h-fit'
          onClick={togglePlay}
          aria-label={isPlaying ? 'bgm 일시중지' : 'bgm 재생'}
        >
          {isPlaying ? (
            <Pause className='w-4 h-4 stroke-gray-900 fill-white' />
          ) : (
            <Play className='w-4 h-4 stroke-gray-900 fill-white' />
          )}
        </button>
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
