import { ReactNode } from 'react';

export default function HideFullscreen({ children }: { children: ReactNode }) {
  return <div className='hide-fullscreen'>{children}</div>;
}
