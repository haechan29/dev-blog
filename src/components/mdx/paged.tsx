import { ReactNode } from 'react';

export default function Paged({ children }: { children: ReactNode }) {
  return <div className='paged'>{children}</div>;
}
