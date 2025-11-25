'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
  const [nickname, setNickname] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  const isFormValid =
    nickname.trim().length >= 2 &&
    nickname.trim().length <= 20 &&
    termsAgreed &&
    privacyAgreed;

  const handleSubmit = () => {
    if (nickname.trim().length < 2 || nickname.trim().length > 20) {
      setIsNicknameValid(false);
      return;
    }

    if (!termsAgreed || !privacyAgreed) {
      return;
    }

    // TODO: 회원가입 처리
    console.log('회원가입:', { nickname, termsAgreed, privacyAgreed });
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
              setIsNicknameValid(true);
              setNickname(e.target.value);
            }}
            placeholder='닉네임을 입력하세요'
            className={clsx(
              'w-full p-3 outline-none border rounded-lg',
              isNicknameValid
                ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
                : 'border-red-400 animate-shake',
              nickname ? 'bg-white' : 'bg-gray-50'
            )}
            maxLength={20}
          />
          <div className='text-sm text-gray-500 mt-1'>
            2-20자, 한글/영문/숫자 사용 가능
          </div>
        </div>

        <div className='mb-6 space-y-3'>
          <div className='flex items-start cursor-pointer'>
            <input
              type='checkbox'
              checked={termsAgreed}
              onChange={e => setTermsAgreed(e.target.checked)}
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
          </div>

          <div className='flex items-start cursor-pointer'>
            <input
              type='checkbox'
              checked={privacyAgreed}
              onChange={e => setPrivacyAgreed(e.target.checked)}
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
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className='w-full h-12 font-bold text-white rounded-lg cursor-pointer bg-blue-600 hover:bg-blue-500'
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
