'use client';

import clsx from 'clsx';
import { Check, Copy } from 'lucide-react';
import { ReactNode, useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export default function Figure({
  children,
  'data-start-offset': startOffset,
  'data-end-offset': endOffset,
  'data-mode': mode,
}: {
  children: ReactNode;
  'data-start-offset': string;
  'data-end-offset': string;
  'data-mode': 'preview' | 'reader' | 'viewer';
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      const code = (e.currentTarget as HTMLElement)
        .closest('figure')
        ?.querySelector('code')?.textContent;

      if (code) {
        try {
          await navigator.clipboard.writeText(code);
          setIsCopied(true);
          toast.success('복사되었습니다', {
            ...(mode === 'viewer' && { id: 'viewer', toasterId: 'viewer' }),
          });
          setTimeout(() => setIsCopied(false), 2000);
        } catch {
          toast.error('복사에 실패했습니다', {
            ...(mode === 'viewer' && { id: 'viewer', toasterId: 'viewer' }),
          });
        }
      }
    },
    [mode]
  );

  return (
    <figure
      className='group relative'
      data-start-offset={startOffset}
      data-end-offset={endOffset}
    >
      {children}
      <button
        onClick={handleCopy}
        className={clsx(
          'hidden group-has-[pre_code]:block absolute top-2 right-3 p-2',
          'bg-white/20 hover:bg-white/30 rounded text-white text-xs cursor-pointer'
        )}
        aria-label='복사'
      >
        {isCopied ? <Check strokeWidth={3} size={16} /> : <Copy size={16} />}
      </button>
    </figure>
  );
}
