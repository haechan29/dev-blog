'use client';

import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CodeBlock({ node }: NodeViewProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const code = node.textContent;

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
    <NodeViewWrapper className='group relative'>
      <pre>
        <button
          onClick={handleCopy}
          className={clsx(
            'absolute top-2 right-3 p-2',
            'hidden group-hover:block',
            'bg-white/20 hover:bg-white/30 rounded text-white text-xs cursor-pointer'
          )}
          aria-label='복사'
          contentEditable={false}
        >
          {isCopied ? <Check strokeWidth={3} size={16} /> : <Copy size={16} />}
        </button>

        <code>
          <NodeViewContent className='block' />
        </code>
      </pre>
    </NodeViewWrapper>
  );
}
