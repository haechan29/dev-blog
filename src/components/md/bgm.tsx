export default function Bgm({
  'data-youtube-url': youtubeUrl,
  'data-start-time': startTime,
}: {
  'data-youtube-url': string;
  'data-start-time': string;
}) {
  const { videoId, timeFromUrl } = parseYouTubeUrl(youtubeUrl);
  const finalStartTime =
    startTime != null ? parseTimeToSeconds(startTime) : timeFromUrl;

  if (!videoId) return;
  const embedUrl = buildEmbedUrl(videoId, finalStartTime);

  return (
    <iframe
      src={embedUrl}
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
