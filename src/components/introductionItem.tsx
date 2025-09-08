'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ChevronsDown } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type IntroductionItemProps = {
  period: string;
  description: string;
};

const introductionItemProps: IntroductionItemProps[] = [
  {
    period: '2023.04 - 2023.12',
    description: '소프트웨어 마에스트로',
  },
  {
    period: '2024.06 - 2025.07',
    description: '캐시닥 안드로이드 개발자',
  },
  {
    period: '현재',
    description: '프론트엔드 개발자로서 성장 중',
  },
];

export default function IntroductionItem({
  className,
}: {
  className?: string;
}) {
  const [isOneSecondElapsed, setIsOneSecondElapsed] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const scrollHander = () => {
      setIsAtTop(window.scrollY == 0);
      window.removeEventListener('scroll', scrollHander);
    };
    const timer = setTimeout(() => setIsOneSecondElapsed(true), 700);

    window.addEventListener('scroll', scrollHander);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', scrollHander);
    };
  }, []);

  return (
    <div className={clsx('flex flex-col min-h-screen', className)}>
      <div className='flex flex-col my-auto'>
        <div className='flex justify-center items-center mb-20'>
          <Image
            src='/images/programmer-looking.png'
            alt='picture of me'
            width={160}
            height={160}
            priority
            className='mr-20 w-auto h-auto'
          />
          <div className='flex items-end'>
            <div className='text-7xl mr-6'>임해찬</div>
            <div className='text-5xl text-gray-500 font-light'>Im Haechan</div>
          </div>
        </div>
        <div className='w-[99vw] left-1/2 -translate-x-1/2 relative'>
          <div className='absolute top-0 inset-x-0 h-2 bg-gray-300 mt-3' />
          <div className='flex'>
            <div className='flex-2' />
            {introductionItemProps.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -5 * (idx + 1) }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.1 * (idx + 2),
                  delay: 0.1 * idx,
                  ease: 'easeOut',
                }}
                key={item.description}
                className='relative basis-[380px] z-10'
              >
                <div className='w-8 h-8 border-4 border-gray-300 bg-white rounded-full ml-4 mb-4' />
                <div className='text-lg text-gray-500 ml-4 mb-1'>
                  {item.period}
                </div>
                <div className='text-2xl font-semibold ml-4'>
                  {item.description}
                </div>
              </motion.div>
            ))}
            <div className='flex-1' />
          </div>
        </div>
      </div>
      <ChevronsDown
        className={clsx(
          'fixed bottom-10 w-10 h-10 text-black place-self-center',
          'animate-bounce transition-opacity duration-700',
          isAtTop && isOneSecondElapsed ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
}
