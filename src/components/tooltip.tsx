'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';

export default function Tooltip({
  text,
  children,
  direction = 'top',
}: {
  text: string;
  children: ReactNode;
  direction?: 'top' | 'bottom' | 'left' | 'right';
}) {
  return (
    <RadixTooltip.Root delayDuration={200}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={direction}
          sideOffset={8}
          collisionPadding={8}
          className='bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50 animate-in fade-in-0 zoom-in-95'
        >
          {text}
          <RadixTooltip.Arrow className='fill-gray-800' />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
