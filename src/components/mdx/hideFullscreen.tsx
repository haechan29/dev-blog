import { ReactNode } from 'react';

/**
 * - hides content in full-screen mode
 * - content is only visible in normal reading mode
 * - Usage: <HideFullscreen>Normal mode only content</HideFullscreen>
 */
export default function HideFullscreen({ children }: { children: ReactNode }) {
  return <div className='hide-fullscreen'>{children}</div>;
}
