import { auth } from '@/auth';
import ContactToolbar from '@/components/contact/contactToolbar';
import clsx from 'clsx';
import { ReactNode } from 'react';

export default async function ContactLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <ContactToolbar isLoggedIn={!!session} />

      <div
        className={clsx(
          'mt-(--toolbar-height) mb-8 px-6 md:px-12 xl:px-18',
          'xl:ml-(--sidebar-width)',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        {children}
      </div>
    </>
  );
}
