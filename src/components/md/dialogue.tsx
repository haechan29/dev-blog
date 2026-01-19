import clsx from 'clsx';
import Image from 'next/image';
import { ReactNode } from 'react';

const colors = [
  'bg-red-300',
  'bg-orange-300',
  'bg-amber-300',
  'bg-green-300',
  'bg-teal-300',
  'bg-blue-300',
  'bg-indigo-300',
  'bg-purple-300',
  'bg-pink-300',
];

export default function Dialogue({
  'data-speaker': speaker,
  'data-avatar': avatar,
  children,
}: {
  'data-speaker': string;
  'data-avatar'?: string;
  children?: ReactNode;
}) {
  const initial = speaker.charAt(0).toUpperCase();
  const color = colors[getColorIndex(speaker)];

  return (
    <div className='my-4 flex gap-3'>
      {avatar ? (
        <Image
          src={avatar}
          alt={speaker}
          width={32}
          height={32}
          className='w-8 h-8 rounded-full object-cover shrink-0'
        />
      ) : (
        <div
          className={clsx(
            'w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-medium',
            color
          )}
        >
          {initial}
        </div>
      )}

      <div className='flex-1'>
        <div className='text-xs text-gray-500'>{speaker}</div>
        <div className='text-gray-900'>{children}</div>
      </div>
    </div>
  );
}

function getColorIndex(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % colors.length;
}
