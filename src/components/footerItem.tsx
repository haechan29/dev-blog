import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';

export default function FooterItem() {
  return (
    <footer className='flex py-20 justify-center gap-16 border-t-1 border-t-gray-200'>
      <a
        href='https://github.com/haechan29'
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center'>
        <Image
          width={20}
          height={20}
          src='/images/github.png'
          alt='github icon'
          className='mr-2'
        />
        <div>github.com/haechan29</div>
      </a>
      <div className='flex items-center'>
        <div className='rounded-full bg-black p-1 mr-2'>
          <Phone className='w-3 h-3 fill-white'/>
        </div>
        <div>+82 10-5634-7522</div>
      </div>
      <div className='flex items-center'>
        <div className='rounded-full bg-black p-1 mr-2'>
          <Mail className='w-3 h-3 text-white'/>
        </div>
        <div>haechan.im@gmail.com</div>
      </div>
    </footer>
  )
}