export default function Bgm({
  'data-video-id': videoId,
  'data-start-time': startTime,
}: {
  'data-video-id': string;
  'data-start-time': string;
}) {
  const embedUrl = buildEmbedUrl(videoId, parseInt(startTime));

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

function buildEmbedUrl(videoId: string, startTime: number | null): string {
  let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`;
  if (startTime) embedUrl += `&start=${startTime}`;
  return embedUrl;
}
