import Link from 'next/link';
import { ReactNode } from 'react';

export default function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return href.startsWith('http') || href.startsWith('//') ? (
    <Link href={href} rel='noopener noreferrer' target='_blank'>
      {children}
    </Link>
  ) : (
    <Link href={href}>{children}</Link>
  );
}
