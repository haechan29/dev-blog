import { processMd } from '@/lib/md/md';
import { ErrorBoundary } from 'react-error-boundary';

export default async function PostParsedContent({
  content,
}: {
  content: string;
}) {
  try {
    const result = await processMd({ source: content, mode: 'reader' });
    return (
      <ErrorBoundary fallback={<div>에러가 발생했습니다</div>}>
        <div data-post-content className='prose'>
          {result}
        </div>
      </ErrorBoundary>
    );
  } catch {
    return <div>에러가 발생했습니다</div>;
  }
}
