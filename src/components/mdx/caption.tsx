import { ReactNode } from 'react';

/**
 * - splits text into sentences when following a Paged element
 * - each sentence creates a separate full-screen page with the paged content
 * - Usage:
 *   <Paged>![image](/path.jpg)</Paged>
 *   <Caption>First sentence. Second sentence. Third sentence.</Caption>
 * - Result: 3 pages, each showing the image with one sentence
 */
export default function Caption({ children }: { children: ReactNode }) {
  return <div className='caption'>{children}</div>;
}
