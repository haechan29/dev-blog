'use client';

import { LockIcon } from '@/components/lockIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import useWritePostForm from '@/features/write/hooks/useWritePostForm';
import { AppDispatch } from '@/lib/redux/store';
import { setVisibility } from '@/lib/redux/write/writePostFormSlice';
import clsx from 'clsx';
import { ChevronDown, Globe, Link2 } from 'lucide-react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

const VISIBILITY_OPTIONS = {
  public: {
    label: '전체 공개',
    description: '피드와 검색에 노출됩니다',
    icon: Globe,
  },
  unlisted: {
    label: '일부 공개',
    description: '링크를 아는 사람만 볼 수 있습니다',
    icon: Link2,
  },
  private: {
    label: '나만 보기',
    description: '나만 볼 수 있습니다',
    icon: LockIcon,
  },
} as const;

export default function WritePostPrivacy() {
  const {
    writePostForm: { visibility },
  } = useWritePostForm();
  const dispatch = useDispatch<AppDispatch>();

  const handleVisibilityChange = useCallback(
    (newVisibility: PostVisibility) => {
      dispatch(setVisibility(newVisibility));
    },
    [dispatch]
  );

  const { label: currentLabel, icon: CurrentIcon } =
    VISIBILITY_OPTIONS[visibility];

  return (
    <div className='flex justify-end items-center gap-3 py-1'>
      <DropdownMenu>
        <DropdownMenuTrigger className='flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors'>
          <CurrentIcon className='w-4 h-4 text-gray-600' />
          <span className='text-sm text-gray-900'>{currentLabel}</span>
          <ChevronDown className='w-4 h-4 text-gray-600' />
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='min-w-64'>
          {Object.entries(VISIBILITY_OPTIONS).map(([value, option]) => {
            const Icon = option.icon;
            const isSelected = visibility === value;

            return (
              <DropdownMenuItem
                key={value}
                onClick={() => handleVisibilityChange(value as PostVisibility)}
                className='flex items-start gap-3 cursor-pointer p-3'
              >
                <Icon
                  className={clsx(
                    'w-5 h-5 mt-0.5',
                    isSelected ? 'text-blue-600' : 'text-gray-500'
                  )}
                />
                <div className='flex-1'>
                  <div
                    className={clsx(
                      'text-sm font-medium',
                      isSelected ? 'text-blue-600' : 'text-gray-900'
                    )}
                  >
                    {option.label}
                  </div>
                  <div className='text-xs text-gray-500 mt-0.5'>
                    {option.description}
                  </div>
                </div>
                {isSelected && <Check className='w-5 h-5 text-blue-600' />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill='currentColor' viewBox='0 0 20 20'>
      <path
        fillRule='evenodd'
        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
        clipRule='evenodd'
      />
    </svg>
  );
}
