'use client';

import { useEffect, useMemo, useState } from 'react';

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
  const [isError, setIsError] = useState(false);
  const embedUrl = useMemo(() => {
    const { videoId, timeFromUrl } = parseYouTubeUrl(youtubeUrl);
    const finalStartTime =
      startTime != null ? parseTimeToSeconds(startTime) : timeFromUrl;

    if (!videoId) return;
    return buildEmbedUrl(videoId, finalStartTime);
  }, [startTime, youtubeUrl]);

  useEffect(() => setIsError(false), [embedUrl]);

  return isError || !embedUrl ? (
    <div
      data-start-offset={startOffset}
      data-end-offset={endOffset}
      className='flex flex-col items-center justify-center p-4 rounded-xl bg-gray-200 text-gray-700 m-4'
      aria-label='유효하지 않은 링크입니다'
    >
      {`유효하지 않은 링크입니다 (${youtubeUrl})`}
    </div>
  ) : (
    <iframe
      data-start-offset={startOffset}
      data-end-offset={endOffset}
      src={embedUrl}
      onError={() => setIsError(true)}
      onLoad={() => setIsError(false)}
      width='560'
      height='315'
      frameBorder='0'
      allowFullScreen
    />
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

function buildEmbedUrl(videoId: string, startTime: number | null): string {
  let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`;
  if (startTime) embedUrl += `&start=${startTime}`;
  return embedUrl;
}
