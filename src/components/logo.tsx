import Link from 'next/link';

export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href='/' className='p-2 -m-2' onClick={onClick}>
      <div className='text-2xl font-bold tracking-tight text-blue-500'>
        Haechan
      </div>
    </Link>
  );
}
