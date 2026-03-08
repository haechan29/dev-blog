'use client';

import clsx from 'clsx';
import { Check, Copy } from 'lucide-react';
import { ReactNode, useState } from 'react';
import toast from 'react-hot-toast';

export default function CodeBlock({ children }: { children?: ReactNode }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    const code = (e.currentTarget as HTMLElement)
      .closest('pre')
      ?.querySelector('code')?.textContent;

    if (code) {
      try {
        await navigator.clipboard.writeText(code);
        setIsCopied(true);
        toast.success('복사되었습니다');
        setTimeout(() => setIsCopied(false), 2000);
      } catch {
        toast.error('복사에 실패했습니다');
      }
    }
  };

  return (
    <pre className='group relative'>
      <button
        onClick={handleCopy}
        className={clsx(
          'absolute top-2 right-3 p-2',
          'bg-white/20 hover:bg-white/30 rounded text-white text-xs cursor-pointer'
        )}
        aria-label='복사'
      >
        {isCopied ? <Check strokeWidth={3} size={16} /> : <Copy size={16} />}
      </button>
      <code>{children}</code>
    </pre>
  );
}
