export function parseYouTubeUrl(url: string, startTime: string | null) {
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

function parseTimeToSeconds(timeStr: string | null) {
  if (timeStr === null) return 0;
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
    return 0;
  }
}
