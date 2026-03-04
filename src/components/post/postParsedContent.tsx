import TiptapRenderer from '@/components/tiptap/renderer/tiptapRenderer';
import { processMd } from '@/lib/md/md';
import { JSONContent } from '@tiptap/core';
import { ErrorBoundary } from 'react-error-boundary';

export default async function PostParsedContent({
  content,
  contentJson,
}: {
  content: string;
  contentJson: JSONContent | null;
}) {
  try {
    return (
      <ErrorBoundary fallback={<div>에러가 발생했습니다</div>}>
        <div data-post-content className='prose'>
          {contentJson ? (
            <TiptapRenderer content={contentJson} />
          ) : (
            await processMd({ source: content, mode: 'reader' })
          )}
        </div>
      </ErrorBoundary>
    );
  } catch {
    return <div>에러가 발생했습니다</div>;
  }
}
