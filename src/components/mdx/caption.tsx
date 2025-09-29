import { ReactNode } from 'react';

export default function Caption({ children }: { children: ReactNode }) {
  return <div className='caption'>{children}</div>;
}
