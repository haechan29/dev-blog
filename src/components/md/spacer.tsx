export default function Spacer({
  'data-lines': linesStr,
  'data-start-offset': startOffset,
  'data-end-offset': endOffset,
}: {
  'data-lines': string;
  'data-start-offset': string;
  'data-end-offset': string;
}) {
  const lines = parseInt(linesStr);
  return (
    <div
      data-start-offset={startOffset}
      data-end-offset={endOffset}
      className={`h-[var(--spacer-height)]`}
      style={{ '--spacer-height': `${lines * 28}px` }}
      aria-hidden='true'
    />
  );
}
