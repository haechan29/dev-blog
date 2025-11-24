import Link from 'next/link';
import { ReactNode } from 'react';

export default function ExternalLink({
  href,
  children,
  'data-start-offset': startOffset,
  'data-end-offset': endOffset,
}: {
  href: string;
  children: ReactNode;
  'data-start-offset': string;
  'data-end-offset': string;
}) {
  return href.startsWith('http') || href.startsWith('//') ? (
    <Link
      href={href}
      rel='noopener noreferrer'
      target='_blank'
      data-start-offset={startOffset}
      data-end-offset={endOffset}
    >
      {children}
    </Link>
  ) : (
    <Link
      href={href}
      data-start-offset={startOffset}
      data-end-offset={endOffset}
    >
      {children}
    </Link>
  );
}
