export default function Spacer({
  'data-lines': lines,
}: {
  'data-lines': string;
}) {
  const lineCount = parseInt(lines);
  return (
    <div
      className={`h-[var(--spacer-height)]`}
      style={{ '--spacer-height': `${lineCount * 28}px` }}
      aria-hidden='true'
    />
  );
}
