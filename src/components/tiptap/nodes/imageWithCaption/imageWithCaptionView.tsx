'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { useState } from 'react';

export default function ImageWithCaptionView({
  node,
  updateAttributes,
}: NodeViewProps) {
  const { src, alt, size } = node.attrs;
  const [isError, setIsError] = useState(false);

  const imageSize = clsx(
    'h-auto',
    size === 'large' ? 'w-full' : 'w-[60%] min-w-[min(480px,100%)]'
  );

  return (
    <NodeViewWrapper className='not-prose flex flex-col items-center gap-4 my-5 lg:my-6 xl:my-7'>
      {isError || !src ? (
        <div className='flex items-center justify-center p-4 rounded-xl bg-gray-200 text-gray-700'>
          이미지를 불러올 수 없습니다
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <img
              src={src}
              alt={alt}
              onError={() => setIsError(true)}
              onLoad={() => setIsError(false)}
              className={clsx(imageSize, 'cursor-pointer')}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => updateAttributes({ size: 'medium' })}
            >
              Medium {size === 'medium' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateAttributes({ size: 'large' })}
            >
              Large {size === 'large' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                /* TODO: 자르기 */
              }}
            >
              자르기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <NodeViewContent className='text-center text-sm text-gray-600' />
    </NodeViewWrapper>
  );
}
