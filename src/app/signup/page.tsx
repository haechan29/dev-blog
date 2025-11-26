'use client';

import { DuplicateNicknameError } from '@/features/user/data/errors/userErrors';
import * as UserClientService from '@/features/user/domain/service/userClientService';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

type NicknameError = 'length' | 'format' | 'duplicate' | null;
const nicknameErrorMessages = {
  length: '닉네임은 2-20자여야 합니다',
  format: '한글, 영문, 숫자만 사용 가능합니다',
  duplicate: '이미 사용 중인 닉네임입니다',
} as const;

export default function SignupPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState<NicknameError>(null);
  const [isTermsValid, setIsTermsValid] = useState(true);
  const [isPrivacyValid, setIsPrivacyValid] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (nickname.trim().length < 2 || nickname.trim().length > 20) {
      setNicknameError('length');
      setIsTermsValid(true);
      setIsPrivacyValid(true);
      return;
    }

    if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname.trim())) {
      setNicknameError('format');
      setIsTermsValid(true);
      setIsPrivacyValid(true);
      return;
    }

    if (!termsAgreed) {
      setNicknameError(null);
      setIsTermsValid(false);
      setIsPrivacyValid(true);
      return;
    }

    if (!privacyAgreed) {
      setNicknameError(null);
      setIsTermsValid(true);
      setIsPrivacyValid(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await UserClientService.createUser({ nickname: nickname.trim() });
      router.push('/');
    } catch (error) {
      if (error instanceof DuplicateNicknameError) {
        setNicknameError('duplicate');
        setIsTermsValid(true);
        setIsPrivacyValid(true);
      } else {
        toast.error('회원가입에 실패했습니다');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md bg-white p-8 rounded-lg border border-gray-200'>
        <div className='mb-8'>
          <div className='text-2xl font-bold mb-2'>회원가입</div>
        </div>
        <div className='mb-6'>
          <div className='block text-sm font-medium mb-2'>닉네임</div>
          <input
            type='text'
            value={nickname}
            onChange={e => {
              setNicknameError(null);
              setNickname(e.target.value);
            }}
            placeholder='닉네임을 입력하세요'
            className={clsx(
              'w-full p-3 outline-none border rounded-lg',
              nicknameError
                ? 'border-red-400 animate-shake'
                : 'border-gray-200 hover:border-blue-500 focus:border-blue-500',
              nickname ? 'bg-white' : 'bg-gray-50'
            )}
            maxLength={20}
          />
          {nicknameError ? (
            <div className='text-sm text-red-500 mt-1'>
              {nicknameErrorMessages[nicknameError]}
            </div>
          ) : (
            <div className='text-sm text-gray-500 mt-1'>
              2-20자, 한글/영문/숫자 사용 가능
            </div>
          )}
        </div>

        <div className='flex flex-col gap-3 mb-6'>
          <label
            className={clsx(
              'flex items-start cursor-pointer rounded',
              !isTermsValid &&
                'bg-red-50 outline-1 outline-red-400 animate-shake p-2 -m-2'
            )}
          >
            <input
              type='checkbox'
              checked={termsAgreed}
              onChange={e => {
                setIsTermsValid(true);
                setTermsAgreed(e.target.checked);
              }}
              className='mt-1 mr-3 w-4 h-4 accent-blue-600'
            />
            <span className='flex-1'>
              <span className='text-sm'>
                서비스 이용약관 동의 <span className='text-red-500'>*</span>
              </span>
              <Link
                href='/terms'
                className='text-sm text-blue-600 ml-1 hover:underline'
                target='_blank'
              >
                보기
              </Link>
            </span>
          </label>

          <label
            className={clsx(
              'flex items-start cursor-pointer rounded',
              !isPrivacyValid &&
                'bg-red-50 outline-1 outline-red-400 animate-shake p-2 -m-2'
            )}
          >
            <input
              type='checkbox'
              checked={privacyAgreed}
              onChange={e => {
                setIsPrivacyValid(true);
                setPrivacyAgreed(e.target.checked);
              }}
              className='mt-1 mr-3 w-4 h-4 accent-blue-600'
            />
            <span className='flex-1'>
              <span className='text-sm'>
                개인정보 처리방침 동의 <span className='text-red-500'>*</span>
              </span>
              <Link
                href='/privacy'
                className='text-sm text-blue-600 ml-1 hover:underline'
                target='_blank'
              >
                보기
              </Link>
            </span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className='w-full h-12 flex justify-center items-center font-bold text-white rounded-lg cursor-pointer bg-blue-600 hover:bg-blue-500'
        >
          {isSubmitting ? (
            <Loader2 size={18} strokeWidth={3} className='animate-spin' />
          ) : (
            <div>시작하기</div>
          )}
        </button>
      </div>
    </div>
  );
}
