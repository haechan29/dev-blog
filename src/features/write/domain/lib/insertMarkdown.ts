export function insertMarkdown({
  content,
  cursorPosition,
  markdown,
  isBlock = true,
}: {
  content: string;
  cursorPosition: number;
  markdown: string;
  isBlock?: boolean;
}) {
  const textBefore = content.substring(0, cursorPosition);
  const textAfter = content.substring(cursorPosition);

  const shouldBreakBefore =
    isBlock && textBefore.trim() && !textBefore.endsWith('\n');
  const shouldBreakAfter =
    isBlock && textAfter.length > 0 && !textAfter.startsWith('\n');

  const newText =
    textBefore +
    (shouldBreakBefore ? '\n' : '') +
    markdown +
    (shouldBreakAfter ? '\n' : '') +
    textAfter;

  const newCursorPosition =
    textBefore.length + (shouldBreakBefore ? 1 : 0) + markdown.length;

  return { newText, newCursorPosition };
}
