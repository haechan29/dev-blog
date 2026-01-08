export default function Spacer({
  'data-start-offset': startOffset,
  'data-end-offset': endOffset,
}: {
  'data-start-offset': string;
  'data-end-offset': string;
}) {
  return (
    <div
      data-start-offset={startOffset}
      data-end-offset={endOffset}
      className='h-7'
      aria-hidden='true'
    />
  );
}
