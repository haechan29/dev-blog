'use client';

import TooltipItem from '@/components/tooltipItem';
import { isMobile } from '@/lib/device';
import { setIsVisible } from '@/lib/redux/postSidebarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { ChevronLeft, FileUser, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

export default function PostSidebarFooter() {
  const mail = process.env.NEXT_PUBLIC_CONTACT_MAIL;
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;
  const dispatch = useDispatch<AppDispatch>();

  const handleMailIconClick = async () => {
    if (mail === undefined) return;
    try {
      await navigator.clipboard.writeText(mail);
      toast.success(`${mail} 복사 완료`);
    } catch {
      toast.error('복사 실패');
    }
  };

  return (
    <div className='flex w-full min-w-0 items-center px-6 py-12 gap-4'>
      <button
        onClick={() => dispatch(setIsVisible(false))}
        className='flex xl:hidden'
      >
        <ChevronLeft className='w-10 h-10 stroke-1 text-gray-900' />
      </button>

      <div className='flex flex-1 min-w-0 justify-center'>
        <div className='flex min-w-0 gap-x-4'>
          {githubUrl && (
            <TooltipItem text='Github'>
              <a
                href={githubUrl}
                onClick={() => dispatch(setIsVisible(false))}
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 flex min-w-0 justify-center items-center rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out'
              >
                {isMobile ? (
                  <div className='flex flex-col items-center min-w-0 gap-y-1'>
                    <Image
                      width={16}
                      height={16}
                      src='/images/github.png'
                      alt='github icon'
                      className='rounded-full'
                    />
                    <div className='text-xs'>Github</div>
                  </div>
                ) : (
                  <Image
                    width={20}
                    height={20}
                    src='/images/github.png'
                    alt='github icon'
                    className='rounded-full'
                  />
                )}
              </a>
            </TooltipItem>
          )}

          {mail && (
            <TooltipItem text={mail}>
              <button
                onClick={handleMailIconClick}
                className='w-10 h-10 flex justify-center items-center cursor-pointer rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out'
              >
                {isMobile ? (
                  <div className='flex flex-col items-center min-w-0 gap-y-1'>
                    <Mail className='w-4 h-4' />
                    <div className='text-xs'>Mail</div>
                  </div>
                ) : (
                  <Mail className='w-5 h-5' />
                )}
              </button>
            </TooltipItem>
          )}

          <TooltipItem text='포트폴리오'>
            <Link
              href='/portfolio'
              onClick={() => dispatch(setIsVisible(false))}
              className='w-10 h-10 flex justify-center items-center cursor-pointer rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out'
            >
              {isMobile ? (
                <div className='flex flex-col items-center min-w-0 gap-y-1'>
                  <FileUser className='w-4 h-4' />
                  <div className='text-xs'>Portfolio</div>
                </div>
              ) : (
                <FileUser className='w-5 h-5' />
              )}
            </Link>
          </TooltipItem>
        </div>
      </div>
    </div>
  );
}
