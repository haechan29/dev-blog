import { processMd } from '@/lib/md';
import { ErrorBoundary } from 'react-error-boundary';

export default async function PostParsedContent({
  content,
}: {
  content: string;
}) {
  try {
    const result = await processMd(content);
    return (
      <ErrorBoundary fallback={<div>에러가 발생했습니다</div>}>
        <div className='prose'>{result}</div>
      </ErrorBoundary>
    );
  } catch {
    return <div>에러가 발생했습니다</div>;
  }
}
