import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Logo({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link href='/' className={cn('p-2 -m-2', className)} onClick={onClick}>
      <div className='text-2xl font-bold tracking-tight text-blue-500'>
        ShareText
      </div>
    </Link>
  );
}
