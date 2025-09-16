import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';

export default function FooterItem() {
  const mail = process.env.NEXT_PUBLIC_CONTACT_MAIL;
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;

  return (
    <footer className='flex py-20 justify-center gap-16 border-t-1 border-t-gray-200'>
      {githubUrl && (
        <a
          href={githubUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center'
        >
          <Image
            width={20}
            height={20}
            src='/images/github.png'
            alt='github icon'
            className='mr-2'
          />
          <div>{githubUrl.replace('https://', '')}</div>
        </a>
      )}
      <div className='flex items-center'>
        <div className='rounded-full bg-black p-1 mr-2'>
          <Phone className='w-3 h-3 fill-white' />
        </div>
        <div>+82 10-5634-7522</div>
      </div>
      {mail && (
        <div className='flex items-center'>
          <div className='rounded-full bg-black p-1 mr-2'>
            <Mail className='w-3 h-3 text-white' />
          </div>
          <div>{mail}</div>
        </div>
      )}
    </footer>
  );
}
