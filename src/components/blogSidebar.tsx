import clsx from 'clsx';
import { FileUser, Mail } from 'lucide-react';
import Image from 'next/image';

export default function BlogSidebar({ className }: { className: string; }) {
  const tags = ['전체', 'Java', 'Android', 'React'];

  return (
    <div className={clsx(
      className,
      'flex flex-col bg-blue-50/30'
    )}>
      <div className="px-6 py-9">
        <a
          className='px-3 py-3 flex flex-col w-fit'
          href='/posts'
        >
          <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Haechan
          </div>
          <div className="text-xs text-gray-400 mt-1 font-light tracking-wide">DEV BLOG</div>
        </a>
      </div>

      <div className='flex flex-col flex-1 overflow-y-auto'>
        {tags.map(tag => {
          return (
            <button
              key={tag}
              className={clsx(
                'flex w-full py-3 px-9 cursor-pointer hover:text-blue-500',
                tag === '전체' ? 'bg-blue-50 font-semibold text-blue-500' : 'text-gray-900'
              )}
            >
              <div className='text-sm'>{tag} (20)</div>
            </button>
          )
        })}
      </div>

      <div className="py-12 flex justify-center items-center gap-x-2">
        <a
          href='https://github.com/haechan29'
          target='_blank'
          rel='noopener noreferrer'
          className='w-10 h-10 flex justify-center items-center rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out'>
          <Image
            width={20}
            height={20}
            src='/images/github.png'
            alt='github icon'
            className='rounded-full'
          />
        </a>
        <button className='w-10 h-10 flex justify-center items-center cursor-pointer rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out'>
          <Mail className='w-5 h-5'/>
        </button>
        <button className='w-10 h-10 flex justify-center items-center cursor-pointer rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out'>
          <FileUser className='w-5 h-5'/>
        </button>
      </div>
    </div>
  );
}