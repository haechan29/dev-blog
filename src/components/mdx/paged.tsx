import { ReactNode } from 'react';

/**
 * - displays content in full-screen mode
 * - Usage: <Paged>![image](/path.jpg)</Paged>
 */
export default function Paged({ children }: { children: ReactNode }) {
  return <div className='paged mb-10'>{children}</div>;
}
