'use client';

import { LockIcon } from '@/components/lockIcon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import clsx from 'clsx';
import { Check, Globe, Link2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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

export default function PublishDialog({
  isOpen,
  onClose,
  onPublish,
  skipPasswordInput,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (data: { visibility: PostVisibility; password: string }) => void;
  skipPasswordInput: boolean;
  isPending: boolean;
}) {
  const [step, setStep] = useState<'visibility' | 'password'>('visibility');
  const [visibility, setVisibility] = useState<PostVisibility>('public');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const handleNext = () => {
    if (skipPasswordInput) {
      onPublish({ visibility, password: '' });
    } else {
      setStep('password');
    }
  };

  const handlePublish = () => {
    if (!password.trim()) {
      setIsPasswordValid(false);
      return;
    }
    onPublish({ visibility, password });
  };

  const handleBack = () => {
    setStep('visibility');
  };

  const handleConfirm = () => {
    if (step === 'visibility') {
      handleNext();
    } else {
      handlePublish();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setStep('visibility');
      setVisibility('public');
      setPassword('');
      setIsPasswordValid(true);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent showCloseButton={false} className='overflow-hidden'>
        <DialogHeader>
          <DialogTitle>글 발행</DialogTitle>
          <DialogDescription className='sr-only'>
            공개범위를 선택하고 글을 발행하세요.
          </DialogDescription>
        </DialogHeader>

        <div className='overflow-hidden -mx-6'>
          <div
            className={clsx(
              'flex w-[200%] transition-transform duration-300 ease-in-out',
              step === 'password' && '-translate-x-1/2'
            )}
          >
            <div className='w-1/2 shrink-0 px-6'>
              <div className='text-sm font-medium text-gray-700 mb-3'>
                공개범위
              </div>
              <div className='flex flex-col gap-2'>
                {Object.entries(VISIBILITY_OPTIONS).map(([value, option]) => {
                  const Icon = option.icon;
                  const isSelected = visibility === value;

                  return (
                    <button
                      key={value}
                      onClick={() => setVisibility(value as PostVisibility)}
                      className={clsx(
                        'flex items-center gap-3 p-3 rounded-sm border transition-colors cursor-pointer',
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <Icon
                        className={clsx(
                          'w-5 h-5',
                          isSelected ? 'text-blue-600' : 'text-gray-500'
                        )}
                      />
                      <div className='flex-1 text-left'>
                        <div
                          className={clsx(
                            'text-sm font-medium',
                            isSelected ? 'text-blue-600' : 'text-gray-900'
                          )}
                        >
                          {option.label}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {option.description}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className='w-5 h-5 text-blue-600' />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className='w-1/2 shrink-0 px-6'>
              <div className='text-sm font-medium text-gray-700 mb-3'>
                비밀번호
              </div>
              <input
                className={clsx(
                  'w-full border p-3 rounded-sm outline-none',
                  isPasswordValid
                    ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
                    : 'border-red-400 animate-shake',
                  password ? 'bg-white' : 'bg-gray-50'
                )}
                type='password'
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setIsPasswordValid(true);
                }}
                placeholder='비밀번호를 입력하세요'
              />
            </div>
          </div>
        </div>

        <DialogFooter className='sm:justify-between'>
          {step === 'password' ? (
            <button
              onClick={handleBack}
              className='px-6 h-10 rounded-sm border border-gray-300 text-sm font-medium hover:bg-gray-50 cursor-pointer'
            >
              이전
            </button>
          ) : (
            <div />
          )}
          <button
            className={clsx(
              'flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white cursor-pointer',
              isPending ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'
            )}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 size={18} strokeWidth={3} className='animate-spin' />
            ) : step === 'password' || skipPasswordInput ? (
              '발행'
            ) : (
              '다음'
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
