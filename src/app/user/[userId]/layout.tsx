import UserToolbar from '@/components/user/userToolbar';
import { ReactNode } from 'react';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <UserToolbar />

      <div className='pt-(--toolbar-height) pb-20 px-6 md:px-12'>
        {children}
      </div>
    </>
  );
}
